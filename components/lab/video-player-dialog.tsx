'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useObjectUrl } from '@/hooks/use-lab-data'
import type { Experiment } from '@/lib/types'

export function VideoPlayerDialog({
  experiment,
  onOpenChange,
}: {
  experiment: Experiment | null
  onOpenChange: (open: boolean) => void
}) {
  const url = useObjectUrl(experiment?.video)

  return (
    <Dialog open={Boolean(experiment)} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-4xl">
        <DialogHeader className="px-5 pt-5 pb-4 pr-12">
          <DialogTitle className="font-heading text-lg font-semibold">
            {experiment ? `${experiment.experimentId} · ${experiment.title}` : 'Experiment Video'}
          </DialogTitle>
          <DialogDescription>Experiment demonstration video</DialogDescription>
        </DialogHeader>
        <div className="bg-foreground">
          {url ? (
            <video key={url} src={url} controls autoPlay playsInline className="aspect-video w-full">
              <track kind="captions" />
            </video>
          ) : (
            <div className="aspect-video w-full" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
