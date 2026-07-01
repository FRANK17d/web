import { getDistricts, type DistrictRow } from '@/lib/admin-data/queries'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable, type Column } from '@/components/ui/data-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { DistrictActions, DistrictCreateForm } from './district-controls'

const columns: Column<DistrictRow>[] = [
  {
    key: 'name',
    header: 'Distrito',
    render: (r) => (
      <div>
        <span className="font-medium">{r.name}</span>
        {(r.province || r.department) && (
          <p className="mt-0.5 text-xs text-neutral-400">
            {[r.province, r.department].filter(Boolean).join(', ')}
          </p>
        )}
      </div>
    ),
  },
  {
    key: 'coords',
    header: 'Coordenadas',
    render: (r) =>
      r.latitude != null && r.longitude != null ? (
        <span className="text-xs text-neutral-500">
          {r.latitude.toFixed(4)}, {r.longitude.toFixed(4)}
        </span>
      ) : (
        <span className="text-xs text-neutral-300">Sin coords</span>
      ),
  },
  {
    key: 'active',
    header: 'Estado',
    render: (r) => <StatusBadge status={r.is_active ? 'active' : 'inactive'} />,
  },
  {
    key: 'created_at',
    header: 'Creacion',
    render: (r) => (
      <span className="text-xs text-neutral-500">
        {new Date(r.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
      </span>
    ),
  },
  {
    key: 'actions',
    header: '',
    className: 'min-w-[420px]',
    render: (r) => <DistrictActions district={r} />,
  },
]

export default async function DistritosPage() {
  const districts = await getDistricts()
  const activeCount = districts.filter((d) => d.is_active).length

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <PageHeader
        eyebrow="Zonas"
        title="Distritos"
        description={`${activeCount} activos de ${districts.length} distritos configurados.`}
      />
      <DistrictCreateForm />
      <DataTable
        columns={columns}
        rows={districts}
        keyExtractor={(r) => String(r.id)}
        emptyMessage="No hay distritos configurados."
      />
    </div>
  )
}
