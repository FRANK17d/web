import { getServiceCategories, type ServiceCategoryRow } from '@/lib/admin-data/queries'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable, type Column } from '@/components/ui/data-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { CategoryActions, CategoryCreateForm } from './category-controls'

const columns: Column<ServiceCategoryRow>[] = [
  {
    key: 'emoji',
    header: '',
    render: (r) => <span className="text-xl">{r.emoji ?? '•'}</span>,
    className: 'w-12',
  },
  {
    key: 'name',
    header: 'Categoría',
    render: (r) => (
      <div>
        <span className="font-medium">{r.name}</span>
        <p className="mt-0.5 text-xs text-neutral-400">/{r.slug}</p>
      </div>
    ),
  },
  {
    key: 'active',
    header: 'Estado',
    render: (r) => <StatusBadge status={r.is_active ? 'active' : 'inactive'} />,
  },
  {
    key: 'created_at',
    header: 'Creación',
    render: (r) => (
      <span className="text-xs text-neutral-500">
        {new Date(r.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
      </span>
    ),
  },
  {
    key: 'actions',
    header: '',
    className: 'min-w-80',
    render: (r) => <CategoryActions category={r} />,
  },
]

export default async function ServiciosPage() {
  const categories = await getServiceCategories()
  const activeCount = categories.filter((category) => category.is_active).length

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <PageHeader
        eyebrow="Catálogo"
        title="Categorías de servicio"
        description={`${activeCount} activas de ${categories.length} categorías configuradas.`}
      />
      <CategoryCreateForm />
      <DataTable
        columns={columns}
        rows={categories}
        keyExtractor={(r) => String(r.id)}
        emptyMessage="No hay categorías configuradas."
      />
    </div>
  )
}
