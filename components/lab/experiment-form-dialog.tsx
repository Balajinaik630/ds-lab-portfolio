'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Experiment, ExperimentInput } from '@/lib/types'
import { isValidUrl } from '@/lib/validation'
import { cn } from '@/lib/utils'
import { ImageField, VideoField } from './media-fields'
import { TagInput } from './tag-input'

type FormErrors = Partial<Record<'experimentId' | 'title' | 'description' | 'technologies' | 'githubUrl', string>>

type ExperimentFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  experiment: Experiment | null
  existingIds: string[]
  onSubmit: (input: ExperimentInput) => Promise<void>
}

export function ExperimentFormDialog(props: ExperimentFormDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="flex max-h-[92dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        {props.open ? <ExperimentForm key={props.experiment?.key ?? 'new'} {...props} /> : null}
      </DialogContent>
    </Dialog>
  )
}

function ExperimentForm({ onOpenChange, experiment, existingIds, onSubmit }: ExperimentFormDialogProps) {
  const isEdit = Boolean(experiment)
  const [values, setValues] = useState<ExperimentInput>(() => ({
    experimentId: experiment?.experimentId ?? '',
    title: experiment?.title ?? '',
    description: experiment?.description ?? '',
    technologies: experiment?.technologies ?? [],
    githubUrl: experiment?.githubUrl ?? '',
    image: experiment?.image ?? null,
    video: experiment?.video ?? null,
  }))
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function update<K extends keyof ExperimentInput>(key: K, value: ExperimentInput[K]) {
    setValues((v) => ({ ...v, [key]: value }))
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate(): FormErrors {
    const next: FormErrors = {}
    const id = values.experimentId.trim()
    if (!id) next.experimentId = 'Experiment ID is required.'
    else if (existingIds.some((x) => x.toLowerCase() === id.toLowerCase()))
      next.experimentId = 'An experiment with this ID already exists.'
    if (!values.title.trim()) next.title = 'Experiment title is required.'
    if (!values.description.trim()) next.description = 'Experiment description is required.'
    if (values.technologies.length === 0) next.technologies = 'Add at least one technology.'
    if (!values.githubUrl.trim()) next.githubUrl = 'GitHub repository URL is required.'
    else if (!isValidUrl(values.githubUrl)) next.githubUrl = 'Enter a valid URL, e.g. https://github.com/username/project'
    return next
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.values(found).some(Boolean)) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await onSubmit({
        ...values,
        experimentId: values.experimentId.trim(),
        title: values.title.trim(),
        description: values.description.trim(),
        githubUrl: values.githubUrl.trim(),
      })
    } catch {
      setSubmitError('Could not save the experiment. Your browser storage may be full — try a smaller video.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
      <DialogHeader className="border-b border-border bg-gradient-to-r from-primary/5 to-violet/5 px-6 pt-6 pb-5">
        <DialogTitle className="font-heading text-2xl font-bold">
          {isEdit ? 'Edit Experiment' : 'Add New Experiment'}
        </DialogTitle>
        <DialogDescription>Fill in the details of your laboratory experiment.</DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="grid gap-5 md:grid-cols-[140px_1fr]">
          <Field id="exp-id" label="Experiment ID" error={errors.experimentId}>
            <Input
              id="exp-id"
              value={values.experimentId}
              onChange={(e) => update('experimentId', e.target.value)}
              placeholder="01"
              maxLength={12}
              aria-invalid={Boolean(errors.experimentId)}
              aria-describedby={errors.experimentId ? 'exp-id-error' : undefined}
              className="h-11 font-mono"
            />
          </Field>
          <Field id="exp-title" label="Experiment Title" error={errors.title}>
            <Input
              id="exp-title"
              value={values.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Data Cleaning using Pandas"
              maxLength={120}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'exp-title-error' : undefined}
              className="h-11"
            />
          </Field>
        </div>

        <div className="mt-5 grid gap-5">
          <Field id="exp-desc" label="Experiment Description" error={errors.description}>
            <Textarea
              id="exp-desc"
              value={values.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Describe your laboratory experiment..."
              rows={5}
              maxLength={2000}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? 'exp-desc-error' : undefined}
              className="min-h-32 resize-y"
            />
          </Field>

          <Field id="exp-tech" label="Technologies" error={errors.technologies}>
            <TagInput
              id="exp-tech"
              value={values.technologies}
              onChange={(tags) => update('technologies', tags)}
              placeholder="Press Enter or type a comma to add each technology."
              invalid={Boolean(errors.technologies)}
              describedBy={errors.technologies ? 'exp-tech-error' : undefined}
            />
          </Field>

          <Field id="exp-github" label="GitHub Repository" error={errors.githubUrl}>
            <Input
              id="exp-github"
              type="url"
              inputMode="url"
              value={values.githubUrl}
              onChange={(e) => update('githubUrl', e.target.value)}
              placeholder="https://github.com/username/project"
              aria-invalid={Boolean(errors.githubUrl)}
              aria-describedby={errors.githubUrl ? 'exp-github-error' : undefined}
              className="h-11 font-mono text-sm"
            />
          </Field>

          <div className="grid gap-6 md:grid-cols-2">
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm font-semibold">Experiment Image</legend>
              <ImageField value={values.image} onChange={(b) => update('image', b)} />
            </fieldset>
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm font-semibold">Experiment Video</legend>
              <VideoField value={values.video} onChange={(b) => update('video', b)} />
            </fieldset>
          </div>
        </div>

        {submitError ? (
          <p role="alert" className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {submitError}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border bg-muted/40 px-6 py-4 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="h-11 px-5"
          onClick={() => onOpenChange(false)}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" className="h-11 px-5" disabled={submitting}>
          {submitting ? <Loader2 className="animate-spin" /> : null}
          {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Experiment'}
        </Button>
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className={cn('text-sm font-semibold', error && 'text-destructive')}>
        {label} <span className="text-destructive" aria-hidden="true">*</span>
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
