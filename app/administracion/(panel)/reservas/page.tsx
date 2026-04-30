import { adminGet, type ApiPaginated } from '@/lib/admin-api'
import { DataTable, type Column } from '@/components/ui/data-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { Pagination } from '@/components/ui/pagination'
import { PageHeader } from '@/components/ui/page-header'
import { FilterSelect } from '@/components/ui/filter-select'

type BookingRow = {
  id: string
  client_id: string
  technician_id: string
  service_id: string
  status: string
  estimated_hours: number
  hourly_rate: number
  estimated_total: number | null
  actual_total: number | null
  scheduled_at: string
  completed_at: string | null
  created_at: string
}

type Props = {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function ReservasPage({ searchParams }: Props) {
  const sp = await searchParams
  const page = Number(sp.page) || 1
  const status = sp.status ?? ''

  const res = await adminGet<ApiPaginated<BookingRow>>('/api/admin/bookings', {
    page,
    limit: 20,
    status: status || undefined,
  })

  const formatCurrency = (n: number | null) =>
    n != null ? `S/ ${n.toFixed(2)}` : '—'

  const columns: Column<BookingRow>[] = [
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
      key: 'scheduled',
      header: 'Programada',
      render: (r) =>
        new Date(r.scheduled_at).toLocaleDateString('es-PE', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    },
    {
      key: 'hours',
      header: 'Horas est.',
      render: (r) => `${r.estimated_hours}h`,
    },
    {
      key: 'rate',
      header: 'Tarifa',
      render: (r) => formatCurrency(r.hourly_rate),
    },
    {
      key: 'total',
      header: 'Total',
      render: (r) => formatCurrency(r.actual_total ?? r.estimated_total),
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
        eyebrow="Operaciones"
        title="Reservas"
        description="Visualiza todas las reservas de la plataforma y su estado."
      />

      <div className="mb-6 flex items-center gap-3">
        <FilterSelect
          paramName="status"
          label="Todos los estados"
          defaultValue={status}
          options={[
            { value: 'pending', label: 'Pendiente' },
            { value: 'confirmed', label: 'Confirmada' },
            { value: 'in_progress', label: 'En curso' },
            { value: 'completed', label: 'Completada' },
            { value: 'cancelled', label: 'Cancelada' },
          ]}
        />
      </div>

      <DataTable
        columns={columns}
        rows={res.datos}
        keyExtractor={(r) => r.id}
        emptyMessage="No hay reservas registradas."
      />

      <Pagination
        currentPage={res.paginacion.pagina}
        totalPages={res.paginacion.totalPaginas}
        basePath="/administracion/reservas"
        searchParams={{ status }}
      />
    </div>
  )
}
