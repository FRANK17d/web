import type { Metadata } from 'next'
import {
  HeroSection,
  ProblemSection,
  ServicesSection,
  HowItWorksSection,
  FeaturesSection,
  StepsSection,
  ProfessionalsSection,
  DownloadCtaSection,
} from '@/components/marketing/sections'

export const metadata: Metadata = {
  title: 'toke+ — Servicios para el hogar a un toque',
  description:
    'Conectamos a los mejores técnicos verificados con hogares en Trujillo. Electricistas, gasfiteros, pintores y más, a un toque de distancia.',
  openGraph: {
    title: 'toke+ — Servicios para el hogar a un toque',
    description: 'Técnicos verificados para tu hogar, al instante.',
    type: 'website',
    locale: 'es_PE',
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <ServicesSection />
      <HowItWorksSection />
      <FeaturesSection />
      <StepsSection />
      <ProfessionalsSection />
      <DownloadCtaSection />
    </>
  )
}
