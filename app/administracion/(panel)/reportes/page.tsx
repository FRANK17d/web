import { adminGet, type ApiPaginated } from '@/lib/admin-api'
import { DataTable, type Column } from '@/components/ui/data-table'
import { Pagination } from '@/components/ui/pagination'
import { PageHeader } from '@/components/ui/page-header'
import { FilterSelect } from '@/components/ui/filter-select'

type AuditLogRow = {
  id: string
  user_id: string | null
  action: string
  table_name: string
  record_id: string | null
  ip_address: string | null
  created_at: string
}

type Props = {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function ReportesPage({ searchParams }: Props) {
  const sp = await searchParams
  const page = Number(sp.page) || 1
  const action = sp.action ?? ''
  const table_name = sp.table_name ?? ''

  const res = await adminGet<ApiPaginated<AuditLogRow>>('/api/admin/audit-logs', {
    page,
    limit: 20,
    action: action || undefined,
    table_name: table_name || undefined,
  })

  const columns: Column<AuditLogRow>[] = [
    {
      key: 'action',
      header: 'Acción',
      render: (r) => <span className="font-medium">{r.action}</span>,
    },
    {
      key: 'table',
      header: 'Tabla',
      render: (r) => (
        <span className="font-mono text-xs text-slate">{r.table_name}</span>
      ),
    },
    {
      key: 'record',
      header: 'Registro',
      render: (r) =>
        r.record_id ? (
          <span className="font-mono text-xs text-slate">
            {r.record_id.slice(0, 8)}...
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'user',
      header: 'Usuario ID',
      render: (r) =>
        r.user_id ? (
          <span className="font-mono text-xs text-slate">
            {r.user_id.slice(0, 8)}...
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'ip',
      header: 'IP',
      render: (r) => r.ip_address ?? '—',
    },
    {
      key: 'created',
      header: 'Fecha',
      render: (r) =>
        new Date(r.created_at).toLocaleDateString('es-PE', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Auditoría"
        title="Reportes y registros"
        description="Registro de actividad y auditoría del sistema."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <FilterSelect
          paramName="table_name"
          label="Todas las tablas"
          defaultValue={table_name}
          options={[
            { value: 'usuarios', label: 'Usuarios' },
            { value: 'reservas', label: 'Reservas' },
            { value: 'servicios', label: 'Servicios' },
            { value: 'disputas', label: 'Disputas' },
            { value: 'verificaciones_tecnico', label: 'Verificaciones' },
            { value: 'perfiles_tecnico', label: 'Perfiles técnico' },
          ]}
        />
      </div>

      <DataTable
        columns={columns}
        rows={res.datos}
        keyExtractor={(r) => r.id}
        emptyMessage="No hay registros de auditoría."
      />

      <Pagination
        currentPage={res.paginacion.pagina}
        totalPages={res.paginacion.totalPaginas}
        basePath="/administracion/reportes"
        searchParams={{ action, table_name }}
      />
    </div>
  )
}
