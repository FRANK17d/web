import { getServiceRequests, type ServiceRequestRow } from '@/lib/admin-data/queries'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable, type Column } from '@/components/ui/data-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { FilterSelect } from '@/components/ui/filter-select'
import { Pagination } from '@/components/ui/pagination'
import { RequestActions } from './request-actions'
import { AutoRefresh } from './auto-refresh'
import Link from 'next/link'

const STATUS_LABELS: Record<string, string> = {
  pending_review: 'En revisión',
  open: 'Abierto',
  assigned: 'Asignado',
  in_progress: 'En curso',
  completed: 'Completado',
  cancelled: 'Cancelado',
  rejected: 'Rechazado',
}

const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))

const columns: Column<ServiceRequestRow>[] = [
  {
    key: 'title',
    header: 'Pedido',
    render: (r) => (
      <div className="flex items-center gap-3">
        {r.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={r.image_url}
            alt=""
            className="h-10 w-10 shrink-0 rounded-lg border border-slate/10 object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-canvas text-base">
            {r.category_emoji || '🧰'}
          </span>
        )}
        <div className="min-w-0">
          <span className="font-medium text-ink">{r.title}</span>
          <p className="mt-0.5 max-w-[220px] truncate text-xs text-slate">{r.description}</p>
        </div>
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
    render: (r) => <span className="text-sm text-slate">{r.district_name}</span>,
  },
  {
    key: 'status',
    header: 'Estado',
    render: (r) => <StatusBadge status={r.status} label={STATUS_LABELS[r.status] ?? r.status} />,
  },
  {
    key: 'date',
    header: 'Fecha',
    render: (r) => (
      <span className="text-xs text-slate">
        {new Date(r.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
      </span>
    ),
  },
  {
    key: 'actions',
    header: '',
    className: 'min-w-[18rem]',
    render: (r) => (
      <div className="flex items-center gap-2">
        <Link
          href={`/gestion-x7k2m9/reservas/${r.id}`}
          className="rounded-lg border border-slate/15 px-3 py-1.5 text-xs font-semibold text-slate transition-colors hover:bg-canvas hover:text-ink"
        >
          Ver detalle
        </Link>
        {r.status === 'pending_review' ? <RequestActions requestId={r.id} title={r.title} /> : null}
      </div>
    ),
  },
]

export default async function ReservasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const { status, page: pageParam } = await searchParams
  const page = Math.max(1, Number.parseInt(pageParam ?? '1', 10) || 1)
  const statusFilter = status && status in STATUS_LABELS ? status : undefined

  const { rows, total, totalPages, pageSize } = await getServiceRequests({
    status: statusFilter,
    page,
  })

  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, total)

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <AutoRefresh />
      <PageHeader
        eyebrow="Moderación"
        title="Pedidos de servicio"
        description="Aprueba o rechaza los pedidos antes de que sean visibles para los técnicos."
        actions={
          <FilterSelect paramName="status" label="Todos los estados" options={STATUS_OPTIONS} defaultValue={statusFilter ?? ''} />
        }
      />

      {total > 0 && (
        <p className="mb-3 text-xs font-medium text-slate">
          Mostrando {rangeStart}–{rangeEnd} de {total} pedido{total === 1 ? '' : 's'}
          {statusFilter ? ` · ${STATUS_LABELS[statusFilter]}` : ''}
        </p>
      )}

      <DataTable
        columns={columns}
        rows={rows}
        keyExtractor={(r) => r.id}
        emptyMessage={statusFilter ? 'No hay pedidos en este estado.' : 'No hay pedidos registrados.'}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/gestion-x7k2m9/reservas"
        searchParams={{ status: statusFilter }}
      />
    </div>
  )
}
