'use client'

import { FlaskConical } from 'lucide-react'
import { GithubIcon } from '@/components/icons/github-icon'
import { useProfile } from '@/hooks/use-lab-data'
import { DEFAULT_GITHUB_URL } from '@/lib/storage'

export function SiteFooter() {
  const { profile } = useProfile()
  const githubUrl = profile?.githubUrl || DEFAULT_GITHUB_URL

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet">
            <FlaskConical className="size-5 text-primary-foreground" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="font-heading text-lg font-bold">Data Science Experiments</p>
            <p className="text-sm text-background/70">B.Tech – CSE (Data Science)</p>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-sm md:text-right">
          <p className="font-semibold">K. Balaji Naik</p>
          <p className="text-background/70">Batch 2028 · Roll No. 24102A030053</p>
        </div>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 w-fit items-center gap-2 rounded-lg border border-background/20 px-4 text-sm font-medium transition-colors hover:bg-background/10"
        >
          <GithubIcon className="size-4" />
          GitHub
        </a>
      </div>
      <div className="border-t border-background/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-background/60 sm:px-6">
          DS LAB · Data Science Laboratory – Experiments &amp; Projects
        </p>
      </div>
    </footer>
  )
}
