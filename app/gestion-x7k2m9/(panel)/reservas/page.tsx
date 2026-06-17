import { getServiceRequests } from '@/lib/admin-data/queries'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable, type Column } from '@/components/ui/data-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { RequestActions } from './request-actions'

type Row = Awaited<ReturnType<typeof getServiceRequests>>[number]

const STATUS_LABELS: Record<string, string> = {
  pending_review: 'En revisión',
  open: 'Abierto',
  assigned: 'Asignado',
  in_progress: 'En curso',
  completed: 'Completado',
  cancelled: 'Cancelado',
  rejected: 'Rechazado',
}

const columns: Column<Row>[] = [
  {
    key: 'title',
    header: 'Pedido',
    render: (r) => (
      <div>
        <span className="font-medium">{r.category_emoji} {r.title}</span>
        <p className="mt-0.5 text-xs text-neutral-400 truncate max-w-[200px]">{r.description}</p>
      </div>
    ),
  },
  {
    key: 'client',
    header: 'Cliente',
    render: (r) => <span className="text-sm">{r.client_name}</span>,
  },
  {
    key: 'district',
    header: 'Distrito',
    render: (r) => <span className="text-sm text-neutral-600">{r.district_name}</span>,
  },
  {
    key: 'status',
    header: 'Estado',
    render: (r) => (
      <StatusBadge status={r.status} label={STATUS_LABELS[r.status] ?? r.status} />
    ),
  },
  {
    key: 'date',
    header: 'Fecha',
    render: (r) => (
      <span className="text-xs text-neutral-500">
        {new Date(r.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
      </span>
    ),
  },
  {
    key: 'actions',
    header: '',
    render: (r) =>
      r.status === 'pending_review' ? <RequestActions requestId={r.id} title={r.title} /> : null,
  },
]

export default async function ReservasPage() {
  const requests = await getServiceRequests()

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <PageHeader
        eyebrow="Moderación"
        title="Pedidos de servicio"
        description="Aprueba o rechaza los pedidos antes de que sean visibles para los técnicos."
      />
      <DataTable columns={columns} rows={requests} keyExtractor={(r) => r.id} emptyMessage="No hay pedidos registrados." />
    </div>
  )
}
