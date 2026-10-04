'use client'

import { CalendarDays, Pencil, PlayCircle, Trash2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { GithubIcon } from '@/components/icons/github-icon'
import { useObjectUrl } from '@/hooks/use-lab-data'
import type { Experiment } from '@/lib/types'
import { cn } from '@/lib/utils'
import { DataPlaceholder } from './data-placeholder'

const dateFormat = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

type ExperimentCardProps = {
  experiment: Experiment
  onEdit: () => void
  onDelete: () => void
  onWatch: () => void
}

export function ExperimentCard({ experiment, onEdit, onDelete, onWatch }: ExperimentCardProps) {
  const imageUrl = useObjectUrl(experiment.image)
  const edited = experiment.updatedAt - experiment.createdAt > 1000

  return (
    <article className="group grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_18px_40px_-18px_oklch(0.52_0.21_263/0.35)] md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div className="relative aspect-video overflow-hidden bg-muted md:aspect-auto md:min-h-full">
        <div className="md:absolute md:inset-0 aspect-video md:aspect-auto size-full">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`Illustration for ${experiment.title}`}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <DataPlaceholder />
          )}
        </div>
        <span className="absolute top-3 left-3 rounded-md bg-card/90 px-2 py-1 font-mono text-xs font-semibold text-primary shadow-sm backdrop-blur-sm md:hidden">
          ID: {experiment.experimentId}
        </span>
      </div>

      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="hidden rounded-md bg-primary/10 px-2 py-1 font-mono text-xs font-semibold text-primary md:inline-block">
            ID: {experiment.experimentId}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {edited ? 'Updated ' : 'Added '}
            {dateFormat.format(edited ? experiment.updatedAt : experiment.createdAt)}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-balance">{experiment.title}</h3>
          <p className="line-clamp-4 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
            {experiment.description}
          </p>
        </div>

        <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
          {experiment.technologies.map((tech) => (
            <li
              key={tech}
              className="rounded-md border border-violet/20 bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-2 pt-2">
          <div className="flex flex-wrap gap-2">
            <a
              href={experiment.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants(), 'h-10 flex-1 px-4 sm:flex-none')}
            >
              <GithubIcon className="size-4" />
              GitHub
            </a>
            {experiment.video ? (
              <Button variant="secondary" className="h-10 flex-1 px-4 sm:flex-none" onClick={onWatch}>
                <PlayCircle />
                Watch Experiment Video
              </Button>
            ) : null}
          </div>
          <div className="flex gap-2 border-t border-border pt-3">
            <Button variant="outline" className="h-10 flex-1 sm:flex-none" onClick={onEdit}>
              <Pencil />
              Edit
            </Button>
            <Button variant="destructive" className="h-10 flex-1 sm:flex-none" onClick={onDelete}>
              <Trash2 />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
