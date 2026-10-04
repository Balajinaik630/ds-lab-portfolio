'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type TagInputProps = {
  id: string
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  invalid?: boolean
  describedBy?: string
}

export function TagInput({ id, value, onChange, placeholder, invalid, describedBy }: TagInputProps) {
  const [draft, setDraft] = useState('')

  function addTags(raw: string) {
    const incoming = raw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    if (incoming.length === 0) return
    const existing = new Set(value.map((t) => t.toLowerCase()))
    const next = [...value]
    for (const tag of incoming) {
      if (!existing.has(tag.toLowerCase()) && tag.length <= 40) {
        existing.add(tag.toLowerCase())
        next.push(tag)
      }
    }
    onChange(next)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTags(draft)
      setDraft('')
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div
      className={cn(
        'flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-card px-2 py-1.5 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30',
        invalid && 'border-destructive focus-within:ring-destructive/20',
      )}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-md bg-primary/10 py-1 pr-1 pl-2 text-xs font-medium text-primary"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="rounded p-0.5 hover:bg-primary/15"
            aria-label={`Remove ${tag}`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => {
          const v = e.target.value
          if (v.includes(',')) {
            addTags(v)
            setDraft('')
          } else {
            setDraft(v)
          }
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (draft.trim()) {
            addTags(draft)
            setDraft('')
          }
        }}
        placeholder={value.length === 0 ? placeholder : 'Add another…'}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className="h-8 min-w-40 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}
