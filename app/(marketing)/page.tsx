import Link from 'next/link'

export default function HomePage() {
  return (
    <section className="bg-surface-100 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700">
              Servicios para el hogar
            </p>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-surface-900 sm:text-5xl">
              Gestion moderna para una red confiable de especialistas
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-surface-600 sm:text-lg">
              MaestroYa conecta operaciones, perfiles y control administrativo en una sola plataforma. El panel admin ya corre sobre Express y el resto del ecosistema seguira la misma arquitectura.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/administracion/iniciar-sesion" className="btn-primary justify-center">
                Ir a administracion
              </Link>
              <Link href="/auth" className="btn-secondary justify-center">
                Ver estado del acceso
              </Link>
            </div>
          </div>

          <div className="rounded-[32px] border border-surface-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Arquitectura', 'Next y mobile consumiendo Express, con InsForge como plataforma de datos y auth.'],
                ['Administracion', 'Login, logout, refresh y recuperacion activos desde el backend.'],
                ['Cliente y tecnico', 'Flujos del frontend en migracion al backend para mantener una sola fuente de verdad.'],
                ['Siguiente paso', 'Conectar modulos reales del panel como usuarios y verificaciones.'],
              ].map(([title, description]) => (
                <div key={title} className="rounded-2xl border border-surface-200 bg-surface-50 p-4">
                  <p className="text-sm font-semibold text-surface-900">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-surface-500">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
