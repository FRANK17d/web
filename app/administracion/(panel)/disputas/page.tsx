import { adminGet, type ApiPaginated } from '@/lib/admin-api'
import { DataTable, type Column } from '@/components/ui/data-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { Pagination } from '@/components/ui/pagination'
import { PageHeader } from '@/components/ui/page-header'
import { FilterSelect } from '@/components/ui/filter-select'

type DisputeRow = {
  id: string
  booking_id: string
  raised_by: string
  reason_category: string
  description: string
  status: 'open' | 'under_review' | 'resolved' | 'closed'
  resolution: string | null
  resolution_note: string | null
  refund_amount: number | null
  created_at: string
}

type Props = {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function DisputasPage({ searchParams }: Props) {
  const sp = await searchParams
  const page = Number(sp.page) || 1
  const status = sp.status ?? ''

  const res = await adminGet<ApiPaginated<DisputeRow>>('/api/admin/disputes', {
    page,
    limit: 20,
    status: status || undefined,
  })

  const columns: Column<DisputeRow>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (r) => (
        <span className="font-mono text-xs text-slate">{r.id.slice(0, 8)}...</span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'reason',
      header: 'Motivo',
      render: (r) => <span className="font-medium">{r.reason_category}</span>,
    },
    {
      key: 'description',
      header: 'Descripción',
      render: (r) => (
        <span className="max-w-[250px] truncate block text-slate">
          {r.description}
        </span>
      ),
    },
    {
      key: 'resolution',
      header: 'Resolución',
      render: (r) => r.resolution ?? '—',
    },
    {
      key: 'refund',
      header: 'Reembolso',
      render: (r) =>
        r.refund_amount != null ? `S/ ${r.refund_amount.toFixed(2)}` : '—',
    },
    {
      key: 'created',
      header: 'Creada',
      render: (r) => new Date(r.created_at).toLocaleDateString('es-PE'),
    },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Soporte"
        title="Disputas"
        description="Gestiona disputas entre clientes y técnicos."
      />

      <div className="mb-6 flex items-center gap-3">
        <FilterSelect
          paramName="status"
          label="Todos los estados"
          defaultValue={status}
          options={[
            { value: 'open', label: 'Abierta' },
            { value: 'under_review', label: 'En revisión' },
            { value: 'resolved', label: 'Resuelta' },
            { value: 'closed', label: 'Cerrada' },
          ]}
        />
      </div>

      <DataTable
        columns={columns}
        rows={res.datos}
        keyExtractor={(r) => r.id}
        emptyMessage="No hay disputas registradas."
      />

      <Pagination
        currentPage={res.paginacion.pagina}
        totalPages={res.paginacion.totalPaginas}
        basePath="/administracion/disputas"
        searchParams={{ status }}
      />
    </div>
  )
}
