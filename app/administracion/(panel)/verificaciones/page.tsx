import { adminGet, type ApiPaginated } from '@/lib/admin-api'
import { DataTable, type Column } from '@/components/ui/data-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { Pagination } from '@/components/ui/pagination'
import { PageHeader } from '@/components/ui/page-header'
import { FilterSelect } from '@/components/ui/filter-select'

type VerificationRow = {
  id: string
  technician_id: string
  admin_id: string
  step: string
  status: 'pending' | 'approved' | 'rejected'
  notes: string | null
  reject_reason: string | null
  created_at: string
}

type Props = {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function VerificacionesPage({ searchParams }: Props) {
  const sp = await searchParams
  const page = Number(sp.page) || 1
  const status = sp.status ?? ''

  const res = await adminGet<ApiPaginated<VerificationRow>>('/api/admin/verifications', {
    page,
    limit: 20,
    status: status || undefined,
  })

  const columns: Column<VerificationRow>[] = [
    {
      key: 'step',
      header: 'Paso',
      render: (r) => <span className="font-medium">{r.step}</span>,
    },
    {
      key: 'status',
      header: 'Estado',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'technician',
      header: 'Técnico ID',
      render: (r) => (
        <span className="font-mono text-xs text-slate">{r.technician_id.slice(0, 8)}...</span>
      ),
    },
    {
      key: 'notes',
      header: 'Notas',
      render: (r) => (
        <span className="max-w-[200px] truncate block text-slate">
          {r.notes ?? r.reject_reason ?? '—'}
        </span>
      ),
    },
    {
      key: 'created',
      header: 'Fecha',
      render: (r) => new Date(r.created_at).toLocaleDateString('es-PE'),
    },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Verificaciones"
        title="Verificaciones de técnicos"
        description="Revisa y gestiona las verificaciones pendientes de los técnicos."
      />

      <div className="mb-6 flex items-center gap-3">
        <FilterSelect
          paramName="status"
          label="Todos los estados"
          defaultValue={status}
          options={[
            { value: 'pending', label: 'Pendiente' },
            { value: 'approved', label: 'Aprobado' },
            { value: 'rejected', label: 'Rechazado' },
          ]}
        />
      </div>

      <DataTable
        columns={columns}
        rows={res.datos}
        keyExtractor={(r) => r.id}
        emptyMessage="No hay verificaciones registradas."
      />

      <Pagination
        currentPage={res.paginacion.pagina}
        totalPages={res.paginacion.totalPaginas}
        basePath="/administracion/verificaciones"
        searchParams={{ status }}
      />
    </div>
  )
}
