import { getPaymentOrders, type PaymentOrderRow } from '@/lib/admin-data/queries'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable, type Column } from '@/components/ui/data-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { FilterSelect } from '@/components/ui/filter-select'
import { Pagination } from '@/components/ui/pagination'
import { ExportCsvButton } from '@/components/admin/export-csv-button'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado',
}

const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))

const KIND_LABELS: Record<string, string> = {
  credits: 'Créditos',
  subscription: 'Suscripción',
}

const columns: Column<PaymentOrderRow>[] = [
  {
    key: 'technician',
    header: 'Técnico',
    render: (r) => <span className="text-sm font-medium text-ink">{r.technician_name}</span>,
  },
  {
    key: 'kind',
    header: 'Tipo',
    render: (r) => (
      <span className="inline-flex items-center rounded-pill bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600">
        {KIND_LABELS[r.kind] ?? r.kind}
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
    key: 'credits',
    header: 'Créditos',
    render: (r) => (
      <span className="text-sm text-slate">
        {r.credits != null ? r.credits : '—'}
      </span>
    ),
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
        {new Date(r.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
      </span>
    ),
  },
]

export default async function TransaccionesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const { status, page: pageParam } = await searchParams
  const page = Math.max(1, Number.parseInt(pageParam ?? '1', 10) || 1)
  const statusFilter = status && status in STATUS_LABELS ? status : undefined

  const { rows, total, totalPages, pageSize } = await getPaymentOrders({
    status: statusFilter,
    page,
  })

  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, total)

  const csvHeaders = ['Técnico', 'Tipo', 'Monto (PEN)', 'Créditos', 'Estado', 'Fecha']
  const csvRows = rows.map((r) => [
    r.technician_name,
    KIND_LABELS[r.kind] ?? r.kind,
    r.amount_pen.toFixed(2),
    r.credits != null ? String(r.credits) : '—',
    STATUS_LABELS[r.status] ?? r.status,
    new Date(r.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' }),
  ])

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <PageHeader
        eyebrow="Finanzas"
        title="Transacciones"
        description="Historial de pagos por compra de créditos y suscripciones TokePro."
        actions={
          <div className="flex items-center gap-3">
            <ExportCsvButton headers={csvHeaders} rows={csvRows} filename="transacciones.csv" />
            <FilterSelect paramName="status" label="Todos los estados" options={STATUS_OPTIONS} defaultValue={statusFilter ?? ''} />
          </div>
        }
      />

      {total > 0 && (
        <p className="mb-3 text-xs font-medium text-slate">
          Mostrando {rangeStart}–{rangeEnd} de {total} transacción{total === 1 ? '' : 'es'}
          {statusFilter ? ` · ${STATUS_LABELS[statusFilter]}` : ''}
        </p>
      )}

      <DataTable
        columns={columns}
        rows={rows}
        keyExtractor={(r) => r.id}
        emptyMessage={statusFilter ? 'No hay transacciones en este estado.' : 'No hay transacciones registradas.'}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/gestion-x7k2m9/transacciones"
        searchParams={{ status: statusFilter }}
      />
    </div>
  )
}
