import { BarChart3, Binary, Database } from 'lucide-react'
import { cn } from '@/lib/utils'

const BARS = [38, 62, 45, 80, 56, 92, 70]

export function DataPlaceholder({ className, label }: { className?: string; label?: string }) {
  return (
    <div
      className={cn(
        'relative flex size-full items-center justify-center overflow-hidden bg-gradient-to-br from-secondary via-background to-accent bg-data-grid',
        className,
      )}
    >
      <div className="absolute inset-x-6 bottom-5 flex h-1/2 items-end gap-2 opacity-60" aria-hidden="true">
        {BARS.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/30 to-violet/40"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <Binary className="absolute top-4 left-4 size-5 text-primary/40" aria-hidden="true" />
      <Database className="absolute top-4 right-4 size-5 text-violet/40" aria-hidden="true" />
      <div className="relative flex flex-col items-center gap-2 rounded-xl border border-border/80 bg-card/80 px-4 py-3 shadow-sm backdrop-blur-sm">
        <BarChart3 className="size-6 text-primary" aria-hidden="true" />
        {label ? <span className="text-xs font-medium text-muted-foreground">{label}</span> : null}
      </div>
    </div>
  )
}
