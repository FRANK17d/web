import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Acceso',
}

export default function AuthPage() {
  return (
    <section className="bg-surface-100 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-[32px] border border-surface-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="inline-flex items-center rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700">
            Integracion en backend
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-surface-900 sm:text-5xl">
            Acceso de cliente y tecnico en migracion
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-surface-600 sm:text-lg">
            El web ya no usa autenticacion directa con InsForge. Los flujos de cliente y tecnico se moveran al backend Express para mantener una sola arquitectura en todos los frontends.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-surface-200 bg-surface-50 p-5">
              <p className="text-sm font-semibold text-surface-900">Estado actual</p>
              <p className="mt-2 text-sm text-surface-600">
                El panel administrativo ya consume Express. Cliente y tecnico quedaran disponibles aqui cuando el backend exponga sus endpoints dedicados.
              </p>
            </div>
            <div className="rounded-2xl border border-surface-200 bg-surface-50 p-5">
              <p className="text-sm font-semibold text-surface-900">Acceso disponible hoy</p>
              <p className="mt-2 text-sm text-surface-600">
                Si eres administrador, usa la nueva ruta en espanol conectada al backend y no a InsForge directo.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/administracion/iniciar-sesion" className="btn-primary justify-center">
              Ir a administracion
            </Link>
            <Link href="/" className="btn-secondary justify-center">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
