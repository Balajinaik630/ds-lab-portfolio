'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Loader2, RefreshCw, Trash2, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useObjectUrl } from '@/hooks/use-lab-data'
import { formatBytes, validateImage, validateVideo } from '@/lib/validation'
import { DataPlaceholder } from './data-placeholder'

type MediaFieldProps = {
  value: Blob | null
  onChange: (file: Blob | null) => void
}

function useFilePicker(validate: (f: File) => string | null, onChange: (f: Blob | null) => void) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  async function handle(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const message = validate(file)
    if (message) {
      setError(message)
      return
    }
    setError(null)
    setProcessing(true)
    try {
      // Read a byte first so unreadable files (e.g. revoked cloud placeholders) fail here, not at save time.
      await file.slice(0, 1).arrayBuffer()
      onChange(file)
    } catch {
      setError('Could not read this file. Please try another one.')
    } finally {
      setProcessing(false)
    }
  }

  return { inputRef, error, processing, handle, open: () => inputRef.current?.click() }
}

export function ImageField({ value, onChange }: MediaFieldProps) {
  const url = useObjectUrl(value)
  const picker = useFilePicker(validateImage, onChange)

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-muted">
        {url ? (
          <img src={url} alt="Experiment image preview" className="size-full object-cover" />
        ) : (
          <DataPlaceholder label="No image uploaded" />
        )}
        {picker.processing ? (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-card/70 text-sm font-medium">
            <Loader2 className="size-4 animate-spin text-primary" />
            Processing image…
          </div>
        ) : null}
      </div>
      <input
        ref={picker.inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        tabIndex={-1}
        aria-label="Experiment image file"
        onChange={picker.handle}
      />
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-10" onClick={picker.open} disabled={picker.processing}>
          {value ? <RefreshCw /> : <ImagePlus />}
          {value ? 'Replace Image' : '+ Upload Experiment Image'}
        </Button>
        {value ? (
          <Button type="button" variant="destructive" className="h-10" onClick={() => onChange(null)}>
            <Trash2 />
            Remove
          </Button>
        ) : null}
      </div>
      <p className="text-xs text-muted-foreground">
        PNG, JPG or WEBP · shown at 16:9{value ? ` · ${formatBytes(value.size)}` : ''}
      </p>
      {picker.error ? (
        <p role="alert" className="text-xs text-destructive">
          {picker.error}
        </p>
      ) : null}
    </div>
  )
}

export function VideoField({ value, onChange }: MediaFieldProps) {
  const url = useObjectUrl(value)
  const picker = useFilePicker(validateVideo, onChange)

  return (
    <div className="flex flex-col gap-3">
      {url ? (
        <div className="overflow-hidden rounded-xl border border-border bg-foreground">
          <video src={url} controls preload="metadata" className="aspect-video w-full">
            <track kind="captions" />
          </video>
        </div>
      ) : (
        <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/60 text-center">
          {picker.processing ? (
            <>
              <Loader2 className="size-6 animate-spin text-primary" />
              <span className="text-sm font-medium">Processing video…</span>
            </>
          ) : (
            <>
              <Video className="size-7 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm text-muted-foreground">No video uploaded</span>
            </>
          )}
        </div>
      )}
      <input
        ref={picker.inputRef}
        type="file"
        accept="video/*"
        className="sr-only"
        tabIndex={-1}
        aria-label="Experiment video file"
        onChange={picker.handle}
      />
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-10" onClick={picker.open} disabled={picker.processing}>
          {value ? <RefreshCw /> : <Video />}
          {value ? 'Replace Video' : '+ Upload Experiment Video'}
        </Button>
        {value ? (
          <Button type="button" variant="destructive" className="h-10" onClick={() => onChange(null)}>
            <Trash2 />
            Remove
          </Button>
        ) : null}
      </div>
      <p className="text-xs text-muted-foreground">
        MP4, WEBM or MOV · up to 300 MB{value ? ` · ${formatBytes(value.size)}` : ''}
      </p>
      {picker.error ? (
        <p role="alert" className="text-xs text-destructive">
          {picker.error}
        </p>
      ) : null}
    </div>
  )
}
