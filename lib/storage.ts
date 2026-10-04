import type { Experiment, ExperimentInput, Profile } from './types'

const DB_NAME = 'ds-lab'
const DB_VERSION = 1
const EXPERIMENTS = 'experiments'
const SETTINGS = 'settings'
const PROFILE_KEY = 'profile'

export const DEFAULT_GITHUB_URL = 'https://github.com/'

let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(EXPERIMENTS)) {
        db.createObjectStore(EXPERIMENTS, { keyPath: 'key' })
      }
      if (!db.objectStoreNames.contains(SETTINGS)) {
        db.createObjectStore(SETTINGS)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => {
      dbPromise = null
      reject(request.error)
    }
  })
  return dbPromise
}

function run<T>(
  storeName: string,
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(storeName, mode)
        const request = action(tx.objectStore(storeName))
        tx.oncomplete = () => resolve(request.result)
        tx.onerror = () => reject(tx.error ?? request.error)
        tx.onabort = () => reject(tx.error ?? new Error('Transaction aborted'))
      }),
  )
}

const idCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

export async function listExperiments(): Promise<Experiment[]> {
  const items = await run<Experiment[]>(EXPERIMENTS, 'readonly', (s) => s.getAll())
  return items.sort((a, b) => idCollator.compare(a.experimentId, b.experimentId))
}

export async function createExperiment(input: ExperimentInput): Promise<Experiment> {
  const now = Date.now()
  const record: Experiment = { ...input, key: crypto.randomUUID(), createdAt: now, updatedAt: now }
  await run(EXPERIMENTS, 'readwrite', (s) => s.add(record))
  return record
}

export async function updateExperiment(key: string, input: ExperimentInput): Promise<Experiment> {
  const existing = await run<Experiment | undefined>(EXPERIMENTS, 'readonly', (s) => s.get(key))
  if (!existing) throw new Error('Experiment not found')
  const record: Experiment = { ...existing, ...input, key, updatedAt: Date.now() }
  await run(EXPERIMENTS, 'readwrite', (s) => s.put(record))
  return record
}

export async function deleteExperiment(key: string): Promise<void> {
  await run(EXPERIMENTS, 'readwrite', (s) => s.delete(key))
}

export async function getProfile(): Promise<Profile> {
  const stored = await run<Profile | undefined>(SETTINGS, 'readonly', (s) => s.get(PROFILE_KEY))
  return { photo: stored?.photo ?? null, githubUrl: stored?.githubUrl ?? DEFAULT_GITHUB_URL }
}

export async function saveProfile(profile: Profile): Promise<Profile> {
  await run(SETTINGS, 'readwrite', (s) => s.put(profile, PROFILE_KEY))
  return profile
}
