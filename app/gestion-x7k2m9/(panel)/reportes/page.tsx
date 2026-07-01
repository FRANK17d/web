import {
  getDashboardStats,
  getOrdersByMonth,
  getRevenueByMonth,
} from '@/lib/admin-data/queries'
import { PageHeader } from '@/components/ui/page-header'
import { OrdersChart, RevenueChart } from './report-charts'

export default async function ReportesPage() {
  const [stats, ordersByMonth, revenueByMonth] = await Promise.all([
    getDashboardStats(),
    getOrdersByMonth(),
    getRevenueByMonth(),
  ])

  const totalOrders6m = ordersByMonth.reduce((sum, m) => sum + m.count, 0)
  const totalRevenue6m = revenueByMonth.reduce((sum, m) => sum + m.amount, 0)

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <PageHeader
        eyebrow="Analitica"
        title="Reportes"
        description="Metricas clave y tendencias de la plataforma."
      />

      {/* KPI summary cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Usuarios totales" value={stats.totalUsers} />
        <KpiCard label="Pedidos (6 meses)" value={totalOrders6m} />
        <KpiCard
          label="Ingresos (6 meses)"
          value={`S/ ${totalRevenue6m.toFixed(2)}`}
        />
        <KpiCard label="Verificaciones pendientes" value={stats.pendingVerifications} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <OrdersChart data={ordersByMonth} />
        <RevenueChart data={revenueByMonth} />
      </div>
    </div>
  )
}

function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-hero border border-slate/10 bg-white px-5 py-4 shadow-card">
      <p className="text-xs font-bold uppercase tracking-eyebrow text-neutral-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-neutral-800">{value}</p>
    </div>
  )
}
