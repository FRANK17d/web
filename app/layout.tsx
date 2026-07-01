import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { inter } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://tokeplus.app'),
  title: {
    default: 'toke+ — Servicios para el hogar en Perú',
    template: '%s | toke+',
  },
  description:
    'Conectamos a los mejores técnicos verificados con hogares en todo el Perú. Electricistas, gasfiteros, pintores y más, a un toque de distancia.',
  keywords: ['servicios hogar', 'técnicos', 'Perú', 'electricista', 'gasfitero', 'plomero', 'pintor', 'toke', 'mantenimiento', 'reparaciones', 'Trujillo'],
  authors: [{ name: 'toke+' }],
  creator: 'toke+',
  publisher: 'toke+',
  manifest: '/manifest.json',
  openGraph: {
    title: 'toke+ — Servicios para el hogar en Perú',
    description: 'Técnicos verificados para tu hogar, al instante.',
    siteName: 'toke+',
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
  twitter: {
    card: 'summary_large_image',
    title: 'toke+ — Servicios para el hogar en Perú',
    description: 'Técnicos verificados para tu hogar, al instante.',
    images: ['/og-whatsapp.jpg'],
    site: '@tokeplus_app',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://tokeplus.app',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only absolute left-4 top-4 z-[100] rounded-btn bg-white px-4 py-2 text-sm font-medium text-ink shadow-nav focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2"
        >
          Saltar al contenido principal
        </a>
        {children}
        <Toaster richColors position="bottom-right" duration={4000} expand={true} />
      </body>
    </html>
  )
}
