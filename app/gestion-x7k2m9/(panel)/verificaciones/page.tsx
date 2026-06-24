import Link from 'next/link'
import { getTechnicianVerifications } from '@/lib/admin-data/queries'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable, type Column } from '@/components/ui/data-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { FilterSelect } from '@/components/ui/filter-select'
import { Pagination } from '@/components/ui/pagination'
import { AutoRefresh } from '@/components/ui/auto-refresh'
import { VerificationActions } from './verification-actions'

type Row = Awaited<ReturnType<typeof getTechnicianVerifications>>['rows'][number]

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  verified: 'Verificado',
  rejected: 'Rechazado',
}

const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))

const columns: Column<Row>[] = [
  {
    key: 'name',
    header: 'Técnico',
    render: (r) => (
      <div>
        <span className="font-medium text-ink">{r.first_name} {r.last_name}</span>
        {r.email && <p className="mt-0.5 text-xs text-neutral-400">{r.email}</p>}
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Estado',
    render: (r) => (
      <StatusBadge
        status={r.verification_status}
        label={STATUS_LABELS[r.verification_status] ?? r.verification_status}
      />
    ),
  },
  {
    key: 'date',
    header: 'Registro',
    render: (r) => (
      <span className="text-xs text-neutral-500">
        {new Date(r.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
      </span>
    ),
  },
  {
    key: 'actions',
    header: '',
    render: (r) => (
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/gestion-x7k2m9/verificaciones/${r.id}`}
          className="rounded-lg border border-slate/15 px-3 py-1.5 text-xs font-semibold text-slate transition-colors hover:bg-canvas hover:text-ink"
        >
          Ver detalles
        </Link>
        {r.verification_status === 'pending' ? (
          <VerificationActions techProfileId={r.id} name={`${r.first_name} ${r.last_name}`} />
        ) : null}
      </div>
    ),
  },
]

export default async function VerificacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const { status, page: pageParam } = await searchParams
  const page = Math.max(1, Number.parseInt(pageParam ?? '1', 10) || 1)
  const statusFilter = status && status in STATUS_LABELS ? status : undefined

  const { rows, total, totalPages, pageSize } = await getTechnicianVerifications({
    status: statusFilter,
    page,
  })

  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, total)

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <AutoRefresh />
      <PageHeader
        eyebrow="Verificaciones"
        title="Verificaciones de técnicos"
        description="Revisa y aprueba la identidad de los técnicos para que puedan postular."
        actions={
          <FilterSelect paramName="status" label="Todos los estados" options={STATUS_OPTIONS} defaultValue={statusFilter ?? ''} />
        }
      />

      {total > 0 && (
        <p className="mb-3 text-xs font-medium text-slate">
          Mostrando {rangeStart}–{rangeEnd} de {total} técnico{total === 1 ? '' : 's'}
          {statusFilter ? ` · ${STATUS_LABELS[statusFilter]}` : ''}
        </p>
      )}

      <DataTable
        columns={columns}
        rows={rows}
        keyExtractor={(r) => r.id}
        emptyMessage={statusFilter ? 'No hay técnicos en este estado.' : 'No hay técnicos registrados.'}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/gestion-x7k2m9/verificaciones"
        searchParams={{ status: statusFilter }}
      />
    </div>
  )
}
