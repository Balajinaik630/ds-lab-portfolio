import { AboutSection } from '@/components/lab/about-section'
import { ExperimentsSection } from '@/components/lab/experiments-section'
import { HeroSection } from '@/components/lab/hero-section'
import { SiteFooter } from '@/components/lab/site-footer'
import { SiteHeader } from '@/components/lab/site-header'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <ExperimentsSection />
        <AboutSection />
      </main>
      <SiteFooter />
    </>
  )
}
