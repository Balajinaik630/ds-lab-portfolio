'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import {
  createExperiment,
  deleteExperiment,
  getProfile,
  listExperiments,
  saveProfile,
  updateExperiment,
} from '@/lib/storage'
import type { ExperimentInput, Profile } from '@/lib/types'

const swrOptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
}

export function useExperiments() {
  const { data, error, isLoading, mutate } = useSWR('ds-lab:experiments', listExperiments, swrOptions)

  return {
    experiments: data ?? [],
    isLoading,
    error,
    add: async (input: ExperimentInput) => {
      await createExperiment(input)
      await mutate()
    },
    update: async (key: string, input: ExperimentInput) => {
      await updateExperiment(key, input)
      await mutate()
    },
    remove: async (key: string) => {
      await deleteExperiment(key)
      await mutate()
    },
  }
}

export function useProfile() {
  const { data, error, isLoading, mutate } = useSWR('ds-lab:profile', getProfile, swrOptions)

  return {
    profile: data,
    isLoading,
    error,
    save: async (next: Profile) => {
      await saveProfile(next)
      await mutate(next, { revalidate: false })
    },
  }
}

export function useObjectUrl(blob: Blob | null | undefined) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!blob) {
      setUrl(null)
      return
    }
    const next = URL.createObjectURL(blob)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [blob])

  return url
}
