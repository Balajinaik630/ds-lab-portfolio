'use client'

import { ArrowDown, Beaker, Code2, LineChart, Network } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { useExperiments } from '@/hooks/use-lab-data'
import { StudentIdCard } from './student-id-card'
import { cn } from '@/lib/utils'

export function HeroSection() {
  const { experiments, isLoading } = useExperiments()

  return (
    <section id="home" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-data-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden="true" />
      <div className="absolute -top-32 -right-32 size-96 rounded-full bg-violet/10 blur-3xl" aria-hidden="true" />
      <div className="absolute top-40 -left-32 size-80 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <div className="flex flex-col gap-6">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
            <Network className="size-3.5" aria-hidden="true" />
            Academic Laboratory Portfolio
          </p>
          <h1 id="hero-title" className="text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            My <span className="text-gradient">Data Science</span> Experiments
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">
            Exploring data, building insights, and applying data science concepts through hands-on academic
            experiments.
          </p>
          <p className="text-sm font-medium text-muted-foreground">
            Data Science Laboratory – Experiments &amp; Projects
          </p>

          <div className="flex flex-wrap items-stretch gap-4">
            <div className="flex min-w-44 items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
              <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet text-primary-foreground">
                <Beaker className="size-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Experiments</p>
                <p className="font-heading text-3xl font-bold tabular-nums" aria-live="polite">
                  {isLoading ? '–' : experiments.length}
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-3 rounded-2xl border border-dashed border-border bg-card/60 px-4 sm:flex">
              <LineChart className="size-5 text-primary" aria-hidden="true" />
              <Code2 className="size-5 text-violet" aria-hidden="true" />
              <span className="text-sm text-muted-foreground">Python · Pandas · ML</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="#experiments" className={cn(buttonVariants({ size: 'lg' }), 'h-11 px-5')}>
              View Experiments
              <ArrowDown />
            </a>
            <a href="#about" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'h-11 px-5')}>
              About Portfolio
            </a>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <StudentIdCard />
        </div>
      </div>
    </section>
  )
}
