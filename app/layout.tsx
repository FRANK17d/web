import type { Metadata } from 'next'
import '@fontsource-variable/plus-jakarta-sans'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'MaestroYa — Servicios para el hogar en Perú',
    template: '%s | MaestroYa',
  },
  description:
    'Conectamos a los mejores técnicos verificados con hogares en todo el Perú. Electricistas, gasfiteros, pintores y más, a un toque de distancia.',
  keywords: ['servicios hogar', 'técnicos', 'Perú', 'electricista', 'gasfitero', 'plomero', 'pintor'],
  openGraph: {
    title: 'MaestroYa — Servicios para el hogar en Perú',
    description: 'Conectamos técnicos verificados con hogares peruanos.',
    type: 'website',
    locale: 'es_PE',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="h-full" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only absolute left-4 top-4 z-[100] rounded-lg bg-white px-4 py-2 text-sm font-medium text-surface-900 shadow-md focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          Saltar al contenido principal
        </a>
        {children}
        <Toaster richColors position="bottom-right" duration={4000} expand={true} />
      </body>
    </html>
  )
}
