'use client'

import { useRef, useState } from 'react'
import { Camera, Check, ExternalLink, GraduationCap, Loader2, Pencil, UserRound, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GithubIcon } from '@/components/icons/github-icon'
import { useObjectUrl, useProfile } from '@/hooks/use-lab-data'
import { DEFAULT_GITHUB_URL } from '@/lib/storage'
import { isValidUrl, validateImage } from '@/lib/validation'
import { cn } from '@/lib/utils'

const DETAILS = [
  { label: 'Degree', value: 'B.Tech – CSE (Data Science)' },
  { label: 'Department', value: 'DATA SCIENCE' },
  { label: 'Roll No', value: '24102A030053' },
  { label: 'Section', value: '1' },
  { label: 'Branch', value: 'B.Tech – CSE (Data Science)' },
  { label: 'Batch', value: '2028' },
  { label: 'Asst. Professor', value: 'S.BoseBabu' },
]

export function StudentIdCard() {
  const { profile, save, isLoading } = useProfile()
  const photoUrl = useObjectUrl(profile?.photo)
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draftUrl, setDraftUrl] = useState('')
  const [urlError, setUrlError] = useState<string | null>(null)

  const githubUrl = profile?.githubUrl || DEFAULT_GITHUB_URL

  async function handlePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !profile) return
    const error = validateImage(file)
    if (error) {
      toast.error(error)
      return
    }
    setUploading(true)
    try {
      await save({ ...profile, photo: file })
      toast.success('Profile photo updated.')
    } catch {
      toast.error('Could not save the profile photo. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  function startEditing() {
    setDraftUrl(githubUrl)
    setUrlError(null)
    setEditing(true)
  }

  async function saveUrl() {
    if (!profile) return
    if (!isValidUrl(draftUrl)) {
      setUrlError('Enter a valid URL, e.g. https://github.com/username')
      return
    }
    await save({ ...profile, githubUrl: draftUrl.trim() })
    setEditing(false)
    toast.success('GitHub repository link updated.')
  }

  return (
    <article
      aria-labelledby="student-card-title"
      className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_20px_50px_-20px_oklch(0.52_0.21_263/0.35)]"
    >
      <div className="relative h-24 bg-gradient-to-r from-primary to-violet">
        <div className="absolute inset-0 bg-dot-grid opacity-40 mix-blend-overlay" aria-hidden="true" />
        <div className="relative flex items-center justify-between px-5 pt-4 text-primary-foreground">
          <div className="flex items-center gap-2">
            <GraduationCap className="size-5" aria-hidden="true" />
            <h2 id="student-card-title" className="text-sm font-semibold tracking-wide uppercase">
              Student ID Card
            </h2>
          </div>
          <span className="rounded-full bg-white/15 px-2.5 py-0.5 font-mono text-xs">DS LAB</span>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="-mt-10 flex items-end gap-4">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-xl border-4 border-card bg-muted shadow-md">
            {photoUrl ? (
              <img src={photoUrl} alt="Profile photo of K. Balaji Naik" className="size-full object-cover" />
            ) : (
              <div className="flex size-full flex-col items-center justify-center gap-1 bg-secondary px-1 text-center">
                <UserRound className="size-7 text-muted-foreground" aria-hidden="true" />
                <span className="text-[10px] leading-tight text-muted-foreground">No profile photo uploaded</span>
              </div>
            )}
            {uploading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-card/70">
                <Loader2 className="size-5 animate-spin text-primary" aria-label="Uploading" />
              </div>
            ) : null}
          </div>
          <div className="min-w-0 pb-1">
            <p className="font-heading text-xl font-bold">K. Balaji Naik</p>
            <p className="text-sm text-muted-foreground">B.Tech – CSE (Data Science)</p>
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={handlePhoto}
          aria-label="Upload profile photo"
          tabIndex={-1}
        />
        <Button
          variant="outline"
          className="mt-4 h-10 w-full"
          disabled={isLoading || uploading}
          onClick={() => fileRef.current?.click()}
        >
          <Camera />
          Upload / Change Profile Photo
        </Button>

        <dl className="mt-5 grid grid-cols-1 gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Name</dt>
            <dd className="font-medium">K. Balaji Naik</dd>
          </div>
          {DETAILS.map((d) => (
            <div key={d.label}>
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{d.label}</dt>
              <dd className={cn('font-medium', d.label === 'Roll No' && 'font-mono')}>{d.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 rounded-xl border border-border bg-muted/50 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <GithubIcon className="size-4" />
              GitHub Repository
            </p>
            {!editing ? (
              <Button variant="ghost" size="sm" onClick={startEditing} disabled={!profile}>
                <Pencil />
                Edit
              </Button>
            ) : null}
          </div>

          {editing ? (
            <form
              className="mt-2 flex flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                void saveUrl()
              }}
            >
              <label htmlFor="profile-github" className="sr-only">
                GitHub repository URL
              </label>
              <Input
                id="profile-github"
                value={draftUrl}
                onChange={(e) => {
                  setDraftUrl(e.target.value)
                  setUrlError(null)
                }}
                placeholder="https://github.com/username"
                aria-invalid={Boolean(urlError)}
                aria-describedby={urlError ? 'profile-github-error' : undefined}
                className="h-10 bg-card"
                autoFocus
              />
              {urlError ? (
                <p id="profile-github-error" className="text-xs text-destructive">
                  {urlError}
                </p>
              ) : null}
              <div className="flex gap-2">
                <Button type="submit" size="sm" className="h-9 flex-1">
                  <Check />
                  Save
                </Button>
                <Button type="button" variant="outline" size="sm" className="h-9 flex-1" onClick={() => setEditing(false)}>
                  <X />
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <>
              <p className="mt-1 truncate font-mono text-xs text-muted-foreground">{githubUrl}</p>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants(), 'mt-3 h-10 w-full')}
              >
                Visit GitHub
                <ExternalLink />
              </a>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
