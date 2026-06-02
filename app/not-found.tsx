import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import { TokeLogo } from '@/components/marketing/toke-logo'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-neutral-950 px-6 py-16 text-center">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-mkt-accent/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        {/* Logo */}
        <TokeLogo size="md" variant="white" />

        {/* 404 number */}
        <p className="mt-10 text-[120px] font-black leading-none tracking-tight text-white/5 sm:text-[160px]">
          404
        </p>

        {/* Message */}
        <div className="-mt-8 sm:-mt-12">
          <h1 className="text-2xl font-black text-white sm:text-3xl">
            Página no encontrada
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-neutral-400 sm:text-base">
            La dirección que buscas no existe o fue movida. Verifica la URL o vuelve al inicio.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-mkt-accent px-7 py-3 text-sm font-bold text-white shadow-xl shadow-mkt-accent/20 transition-transform duration-200 hover:scale-[1.03]"
          >
            <Home className="h-4 w-4" />
            Ir al inicio
          </Link>
          <Link
            href="/servicios"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-7 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-white/10"
          >
            <Search className="h-4 w-4" />
            Ver servicios
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-16 text-xs text-neutral-600">
          toke+ — Servicios para el hogar
        </p>
      </div>
    </div>
  )
}
