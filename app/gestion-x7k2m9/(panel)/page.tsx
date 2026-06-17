import {
  AlertTriangle,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  ShieldCheck,
  Users,
  Wrench,
} from 'lucide-react'
import { getAdminSession } from '@/lib/admin-auth/server'
import { getDashboardStats, getCreditStats } from '@/lib/admin-data/queries'
import { StatCard } from '@/components/ui/stat-card'

export default async function AdministracionPage() {
  const [admin, stats, credits] = await Promise.all([
    getAdminSession(),
    getDashboardStats(),
    getCreditStats(),
  ])

  return (
    <div>
      <div className="mb-10">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#EE7070]">
          Panel de control
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-800">
          Bienvenido, {admin?.nombreCompleto.split(' ')[0] ?? 'Administrador'}
        </h1>
        <p className="mt-2 max-w-lg text-sm text-neutral-500 leading-relaxed">
          Resumen general de TOKE+. Datos en tiempo real desde Insforge.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Usuarios" value={stats.totalUsers} icon={Users} detail="registrados" />
        <StatCard label="Pedidos" value={stats.totalRequests} icon={CalendarDays} detail="publicados" />
        <StatCard
          label="Verificaciones"
          value={stats.pendingVerifications}
          icon={ShieldCheck}
          detail="técnicos pendientes"
        />
        <StatCard
          label="Por moderar"
          value={stats.pendingModeration}
          icon={AlertTriangle}
          detail="pedidos en revisión"
        />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Créditos en circulación"
          value={credits.totalCredits}
          icon={CreditCard}
          detail={`${credits.wallets} billeteras`}
        />
        <StatCard label="Servicios activos" value={stats.activeServices} icon={Wrench} detail="categorías" />
        <StatCard label="Auditoría" value="—" icon={ClipboardCheck} detail="próximamente" />
      </div>
    </div>
  )
}
