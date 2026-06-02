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
    url: 'https://tokeplus.app',
    images: [
      {
        url: '/og-whatsapp.jpg',
        width: 1200,
        height: 630,
        alt: 'toke+ — Servicios para el hogar en Perú',
      },
    ],
  },
  alternates: {
    canonical: 'https://tokeplus.app',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'toke+',
  url: 'https://tokeplus.app',
  description:
    'Plataforma que conecta hogares con técnicos verificados para servicios de mantenimiento, reparación e instalación en Trujillo, Perú.',
  applicationCategory: 'HomeServices',
  operatingSystem: 'Android, iOS',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'PEN',
    description: 'Descarga gratuita',
  },
  provider: {
    '@type': 'Organization',
    name: 'toke+',
    url: 'https://tokeplus.app',
    logo: 'https://tokeplus.app/toke-logo.svg',
    areaServed: {
      '@type': 'City',
      name: 'Trujillo',
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'La Libertad, Perú',
      },
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'soporte@toke.app',
      availableLanguage: 'Spanish',
    },
  },
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
