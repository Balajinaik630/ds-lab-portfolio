'use client'

import { useState } from 'react'
import { FlaskConical, Menu } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { GithubIcon } from '@/components/icons/github-icon'
import { useProfile } from '@/hooks/use-lab-data'
import { DEFAULT_GITHUB_URL } from '@/lib/storage'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#experiments', label: 'Experiments' },
  { href: '#about', label: 'About' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { profile } = useProfile()
  const githubUrl = profile?.githubUrl || DEFAULT_GITHUB_URL

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        <a href="#home" className="flex items-center gap-2.5" aria-label="DS LAB home">
          <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet text-primary-foreground shadow-sm">
            <FlaskConical className="size-5" aria-hidden="true" />
          </span>
          <span className="font-heading text-lg font-bold tracking-tight">DS LAB</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'outline' }), 'hidden h-9 px-3 sm:inline-flex')}
          >
            <GithubIcon className="size-4" />
            GitHub
          </a>
          <Button
            variant="ghost"
            size="icon-lg"
            className="md:hidden"
            aria-label="Open navigation menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </nav>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle className="font-heading">DS LAB</SheetTitle>
          </SheetHeader>
          <ul className="flex flex-col gap-1 px-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex h-12 items-center rounded-lg px-3 text-base font-medium hover:bg-muted"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="px-4">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: 'outline' }), 'h-11 w-full')}
            >
              <GithubIcon className="size-4" />
              GitHub
            </a>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
