import Link from 'next/link'
import { Logo } from '@/components/logo'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas antialiased">
      <div className="flex flex-1 items-center justify-center p-6">
        {/* White card on canvas cream */}
        <div className="w-full max-w-lg rounded-hero border border-slate/10 bg-white shadow-card p-10 sm:p-14">
          <div className="flex flex-col items-start text-left">

            {/* Logo circle */}
            <div className="flex h-12 w-12 items-center justify-center rounded-pill bg-canvas border border-slate/15 mb-8">
              <Logo className="h-6 w-6 text-ink" />
            </div>

            {/* Ghost watermark context */}
            <p className="eyebrow mb-4">Error del sistema</p>

            <h1 className="text-[28px] font-medium tracking-headline text-ink leading-tight">
              Página no encontrada
            </h1>

            <p className="mt-4 text-[15px] text-slate leading-relaxed">
              La ruta solicitada no existe en el sistema. Asegúrate de que la
              dirección web sea correcta o de que tengas los permisos
              correspondientes.
            </p>

            {/* Ink-pill CTA */}
            <div className="mt-10">
              <Link
                href="/"
                className="btn-primary text-sm px-7 py-2.5"
              >
                Volver a la plataforma
              </Link>
            </div>

            {/* Footer row */}
            <div className="mt-12 flex items-center justify-between w-full border-t border-slate/10 pt-6">
              <span className="eyebrow text-[10px]">Error 404</span>
              <span className="text-xs text-slate">MaestroYa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
