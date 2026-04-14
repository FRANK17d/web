import Link from 'next/link'

export default function AccountPage() {
  return (
    <section className="bg-surface-100 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="rounded-[32px] border border-surface-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Cuenta</p>
          <h1 className="mt-3 text-3xl font-bold text-surface-900">Vista temporalmente deshabilitada</h1>
          <p className="mt-4 text-sm leading-6 text-surface-600">
            Esta pantalla dependia de autenticacion directa desde el frontend hacia InsForge. Se deshabilito para mantener la arquitectura correcta: frontend web y mobile consumen solo el backend Express.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/auth" className="btn-secondary justify-center">
              Ver estado del acceso
            </Link>
            <Link href="/administracion/iniciar-sesion" className="btn-primary justify-center">
              Ir a administracion
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
