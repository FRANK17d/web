import {
  AlertTriangle,
  CalendarDays,
  ClipboardCheck,
  ShieldCheck,
  Users,
  Wrench,
} from 'lucide-react'
import { getAdminSession } from '@/lib/admin-auth/server'
import { adminGet, type ApiOk } from '@/lib/admin-api'
import { StatCard } from '@/components/ui/stat-card'

type DashboardStats = {
  usuarios: { total: number; activos: number; admins: number; clientes: number; tecnicos: number }
  reservas: { total: number; pendientes: number; activas: number; completadas: number; canceladas: number }
  servicios: { total: number; activos: number; categorias: number }
  disputas: { abiertas: number; total: number }
  verificaciones: { pendientes: number }
  auditoria: { total: number }
}

export default async function AdministracionPage() {
  const admin = await getAdminSession()

  let stats: DashboardStats | null = null
  try {
    const res = await adminGet<ApiOk<DashboardStats>>('/api/admin/dashboard/stats')
    stats = res.datos
  } catch {
    // stats stays null — show fallback
  }

  return (
    <div>
      {/* Section header */}
      <div className="mb-10">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#EE7070]">
          Panel de control
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-800">
          Bienvenido, {admin?.nombreCompleto.split(' ')[0] ?? 'Administrador'}
        </h1>
        <p className="mt-2 max-w-lg text-sm text-neutral-500 leading-relaxed">
          Resumen general de toke+. Los datos se cargan en tiempo real desde
          el backend.
        </p>
      </div>

      {/* KPI grid — top level */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Usuarios"
          value={stats?.usuarios.total ?? '—'}
          icon={Users}
          detail={stats ? `${stats.usuarios.activos} activos` : undefined}
        />
        <StatCard
          label="Reservas"
          value={stats?.reservas.total ?? '—'}
          icon={CalendarDays}
          detail={stats ? `${stats.reservas.pendientes} pendientes` : undefined}
        />
        <StatCard
          label="Verificaciones"
          value={stats?.verificaciones.pendientes ?? '—'}
          icon={ShieldCheck}
          detail="pendientes de revisión"
        />
        <StatCard
          label="Disputas"
          value={stats?.disputas.abiertas ?? '—'}
          icon={AlertTriangle}
          detail={stats ? `de ${stats.disputas.total} total` : undefined}
        />
      </div>

      {/* Second row — breakdown cards */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Servicios"
          value={stats?.servicios.total ?? '—'}
          icon={Wrench}
          detail={stats ? `${stats.servicios.activos} activos · ${stats.servicios.categorias} categorías` : undefined}
        />
        <StatCard
          label="Reservas activas"
          value={stats?.reservas.activas ?? '—'}
          icon={CalendarDays}
          detail={stats ? `${stats.reservas.completadas} completadas` : undefined}
        />
        <StatCard
          label="Auditoría"
          value={stats?.auditoria.total ?? '—'}
          icon={ClipboardCheck}
          detail="registros de actividad"
        />
      </div>

      {/* Info panels */}
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-400 mb-4">
            Usuarios por rol
          </p>
          <div className="space-y-3">
            {[
              { label: 'Administradores', val: stats?.usuarios.admins },
              { label: 'Clientes', val: stats?.usuarios.clientes },
              { label: 'Técnicos', val: stats?.usuarios.tecnicos },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">{item.label}</span>
                <span className="text-sm font-semibold text-neutral-800">
                  {item.val?.toLocaleString('es-PE') ?? '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-400 mb-4">
            Reservas por estado
          </p>
          <div className="space-y-3">
            {[
              { label: 'Pendientes', val: stats?.reservas.pendientes },
              { label: 'Activas', val: stats?.reservas.activas },
              { label: 'Completadas', val: stats?.reservas.completadas },
              { label: 'Canceladas', val: stats?.reservas.canceladas },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">{item.label}</span>
                <span className="text-sm font-semibold text-neutral-800">
                  {item.val?.toLocaleString('es-PE') ?? '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
