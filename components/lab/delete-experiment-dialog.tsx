'use client'

import { useState } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Experiment } from '@/lib/types'

export function DeleteExperimentDialog({
  experiment,
  onOpenChange,
  onConfirm,
}: {
  experiment: Experiment | null
  onOpenChange: (open: boolean) => void
  onConfirm: (experiment: Experiment) => Promise<void>
}) {
  const [deleting, setDeleting] = useState(false)

  async function handleConfirm() {
    if (!experiment) return
    setDeleting(true)
    try {
      await onConfirm(experiment)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog open={Boolean(experiment)} onOpenChange={(open) => !deleting && onOpenChange(open)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <Trash2 />
          </AlertDialogMedia>
          <AlertDialogTitle>Are you sure you want to delete this experiment?</AlertDialogTitle>
          <AlertDialogDescription>
            {experiment ? `"${experiment.experimentId} · ${experiment.title}" ` : ''}
            will be permanently removed, including its image and video.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-10" disabled={deleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="h-10 bg-destructive text-white hover:bg-destructive/90"
            onClick={handleConfirm}
            disabled={deleting}
          >
            {deleting ? <Loader2 className="animate-spin" /> : null}
            Delete Experiment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
