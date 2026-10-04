'use client'

import { useState } from 'react'
import { AlertTriangle, FlaskConical, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useExperiments } from '@/hooks/use-lab-data'
import type { Experiment, ExperimentInput } from '@/lib/types'
import { DeleteExperimentDialog } from './delete-experiment-dialog'
import { ExperimentCard } from './experiment-card'
import { ExperimentFormDialog } from './experiment-form-dialog'
import { VideoPlayerDialog } from './video-player-dialog'

export function ExperimentsSection() {
  const { experiments, isLoading, error, add, update, remove } = useExperiments()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Experiment | null>(null)
  const [deleting, setDeleting] = useState<Experiment | null>(null)
  const [watching, setWatching] = useState<Experiment | null>(null)

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(experiment: Experiment) {
    setEditing(experiment)
    setFormOpen(true)
  }

  async function handleSubmit(input: ExperimentInput) {
    if (editing) {
      await update(editing.key, input)
      toast.success('Experiment updated successfully.')
    } else {
      await add(input)
      toast.success('Experiment added successfully.')
    }
    setFormOpen(false)
  }

  async function handleDelete(experiment: Experiment) {
    try {
      await remove(experiment.key)
      setDeleting(null)
      toast.success('Experiment deleted successfully.')
    } catch {
      toast.error('Could not delete the experiment. Please try again.')
    }
  }

  const otherIds = experiments.filter((e) => e.key !== editing?.key).map((e) => e.experimentId)

  return (
    <section id="experiments" aria-labelledby="experiments-title" className="border-y border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs font-semibold tracking-widest text-primary uppercase">
              {'// Lab Records'}
            </p>
            <h2 id="experiments-title" className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Data Science Experiments
            </h2>
            <p className="text-muted-foreground">Maintain and organize your academic laboratory experiments.</p>
          </div>
          <Button size="lg" className="h-11 px-5 shadow-md shadow-primary/20" onClick={openCreate}>
            <Plus />
            Add New Experiment
          </Button>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading experiments">
              {[0, 1].map((i) => (
                <div key={i} className="grid h-64 animate-pulse overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-[5fr_6fr]">
                  <div className="bg-muted" />
                  <div className="flex flex-col gap-3 p-6">
                    <div className="h-5 w-16 rounded bg-muted" />
                    <div className="h-6 w-2/3 rounded bg-muted" />
                    <div className="h-4 w-full rounded bg-muted" />
                    <div className="h-4 w-4/5 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div role="alert" className="flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
              <AlertTriangle className="size-5 shrink-0" />
              <p className="text-sm">
                Could not load experiments from browser storage. Make sure storage is enabled and refresh the page.
              </p>
            </div>
          ) : experiments.length === 0 ? (
            <EmptyState onAdd={openCreate} />
          ) : (
            <ul className="flex flex-col gap-6">
              {experiments.map((experiment) => (
                <li key={experiment.key}>
                  <ExperimentCard
                    experiment={experiment}
                    onEdit={() => openEdit(experiment)}
                    onDelete={() => setDeleting(experiment)}
                    onWatch={() => setWatching(experiment)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ExperimentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        experiment={editing}
        existingIds={otherIds}
        onSubmit={handleSubmit}
      />
      <DeleteExperimentDialog
        experiment={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={handleDelete}
      />
      <VideoPlayerDialog experiment={watching} onOpenChange={(open) => !open && setWatching(null)} />
    </section>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border bg-card px-6 py-16 text-center">
      <div className="absolute inset-0 bg-dot-grid opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-md flex-col items-center gap-4">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-violet/15 text-primary ring-1 ring-primary/20">
          <FlaskConical className="size-8" aria-hidden="true" />
        </span>
        <h3 className="text-xl font-bold">No Experiments Added Yet</h3>
        <p className="text-pretty text-muted-foreground">
          Start building your academic portfolio by adding your first Data Science experiment.
        </p>
        <Button size="lg" className="mt-2 h-11 px-5" onClick={onAdd}>
          <Plus />
          Add New Experiment
        </Button>
      </div>
    </div>
  )
}
