import { ClipboardList, Cpu, GitBranch } from 'lucide-react'

const FEATURES = [
  {
    icon: ClipboardList,
    title: 'Experiment Records',
    text: 'Clear descriptions of each laboratory task.',
  },
  {
    icon: Cpu,
    title: 'Technologies Used',
    text: 'Tools and libraries tagged for every experiment.',
  },
  {
    icon: GitBranch,
    title: 'GitHub Repositories',
    text: 'Direct links to each implementation.',
  },
]

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto flex max-w-2xl flex-col gap-4 text-center">
          <p className="font-mono text-xs font-semibold tracking-widest text-primary uppercase">{'// About'}</p>
          <h2 id="about-title" className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            About This Portfolio
          </h2>
          <p className="leading-relaxed text-pretty text-muted-foreground">
            This website is an academic portfolio for maintaining Data Science laboratory experiments. Each
            experiment contains its description, technologies used, and a GitHub repository link for accessing the
            implementation.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-violet/10 text-primary ring-1 ring-primary/15 transition-colors group-hover:from-primary group-hover:to-violet group-hover:text-primary-foreground">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
