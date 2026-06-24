import { getActiveSubscribers, type SubscriberRow } from '@/lib/admin-data/queries'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable, type Column } from '@/components/ui/data-table'

const columns: Column<SubscriberRow>[] = [
  {
    key: 'technician',
    header: 'Técnico',
    render: (r) => <span className="text-sm font-medium text-ink">{r.technician_name}</span>,
  },
  {
    key: 'plan',
    header: 'Plan',
    render: (r) => (
      <span className="inline-flex items-center gap-1.5 text-sm">
        <span className="text-amber-500">&#9733;</span>
        {r.plan_name}
      </span>
    ),
  },
  {
    key: 'amount',
    header: 'Monto (PEN)',
    render: (r) => (
      <span className="text-sm font-mono font-medium">
        S/ {r.amount_pen.toFixed(2)}
      </span>
    ),
  },
  {
    key: 'date',
    header: 'Fecha de pago',
    render: (r) => (
      <span className="text-xs text-slate">
        {new Date(r.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
      </span>
    ),
  },
]

export default async function SuscriptoresPage() {
  const subscribers = await getActiveSubscribers()

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <PageHeader
        eyebrow="TokePro"
        title="Suscriptores activos"
        description="Técnicos con suscripción TokePro aprobada."
      />

      {subscribers.length > 0 && (
        <p className="mb-3 text-xs font-medium text-slate">
          {subscribers.length} suscriptor{subscribers.length === 1 ? '' : 'es'} activo{subscribers.length === 1 ? '' : 's'}
        </p>
      )}

      <DataTable
        columns={columns}
        rows={subscribers}
        keyExtractor={(r) => r.id}
        emptyMessage="No hay suscriptores activos."
      />
    </div>
  )
}
