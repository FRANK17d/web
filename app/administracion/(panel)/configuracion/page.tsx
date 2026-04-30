import { PageHeader } from '@/components/ui/page-header'
import { getAdminSession } from '@/lib/admin-auth/server'

export default async function ConfiguracionPage() {
  const admin = await getAdminSession()

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Sistema"
        title="Configuración"
        description="Ajustes del panel de administración."
      />

      {/* Admin profile card */}
      <div className="max-w-xl rounded-hero border border-slate/10 bg-white p-8 shadow-card">
        <p className="eyebrow mb-4">Perfil del administrador</p>
        <div className="space-y-4">
          <div className="flex justify-between border-b border-slate/5 pb-3">
            <span className="text-sm text-slate">Nombre</span>
            <span className="text-sm font-medium text-ink">
              {admin?.nombreCompleto ?? '—'}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate/5 pb-3">
            <span className="text-sm text-slate">Email</span>
            <span className="text-sm font-medium text-ink">
              {admin?.email ?? '—'}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate/5 pb-3">
            <span className="text-sm text-slate">Rol</span>
            <span className="text-sm font-medium text-ink">Administrador</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate">Último ingreso</span>
            <span className="text-sm font-medium text-ink">
              {admin?.ultimoIngreso
                ? new Date(admin.ultimoIngreso).toLocaleString('es-PE')
                : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Placeholder sections */}
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="flex flex-col items-center justify-center rounded-hero border border-dashed border-slate/30 bg-canvas px-8 py-16 text-center">
          <p className="text-sm font-medium text-ink">Gestión de categorías</p>
          <p className="mt-1 text-xs text-slate">
            CRUD completo de categorías de servicio — próximamente.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-hero border border-dashed border-slate/30 bg-canvas px-8 py-16 text-center">
          <p className="text-sm font-medium text-ink">Variables de entorno</p>
          <p className="mt-1 text-xs text-slate">
            Configuración de tasas de comisión, timeouts, etc. — próximamente.
          </p>
        </div>
      </div>
    </div>
  )
}
