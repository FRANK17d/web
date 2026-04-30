import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'toke+ — Servicios para el hogar en Perú',
    template: '%s | toke+',
  },
  description:
    'Conectamos a los mejores técnicos verificados con hogares en todo el Perú. Electricistas, gasfiteros, pintores y más, a un toque de distancia.',
  keywords: ['servicios hogar', 'técnicos', 'Perú', 'electricista', 'gasfitero', 'plomero', 'pintor', 'toke'],
  icons: {
    icon: [{ url: '/logo2_toke+.png', type: 'image/png', sizes: '1092x931' }],
    shortcut: '/logo2_toke+.png',
    apple: [{ url: '/logo2_toke+.png', type: 'image/png', sizes: '1092x931' }],
  },
  openGraph: {
    title: 'toke+ — Servicios para el hogar en Perú',
    description: 'Técnicos verificados para tu hogar, al instante.',
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
