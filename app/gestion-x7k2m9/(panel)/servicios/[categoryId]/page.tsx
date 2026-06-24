import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DataTable, type Column } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import {
  getServiceCategoryById,
  getServicesByCategory,
  type ServiceItemRow,
} from '@/lib/admin-data/queries'
import { ServiceActions, ServiceCreateForm } from './service-controls'

const dateFormatter = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: 'short',
})

const columns: Column<ServiceItemRow>[] = [
  {
    key: 'name',
    header: 'Servicio',
    render: (r) => <span className="font-medium">{r.name}</span>,
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
        {dateFormatter.format(new Date(r.created_at))}
      </span>
    ),
  },
  {
    key: 'actions',
    header: '',
    className: 'min-w-96',
    render: (r) => <ServiceActions service={r} />,
  },
]

export default async function CategoriaServiciosPage({
  params,
}: {
  params: Promise<{ categoryId: string }>
}) {
  const { categoryId } = await params
  const parsedCategoryId = Number(categoryId)

  if (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0) {
    notFound()
  }

  const [category, services] = await Promise.all([
    getServiceCategoryById(parsedCategoryId),
    getServicesByCategory(parsedCategoryId),
  ])

  if (!category) notFound()

  const activeCount = services.filter((service) => service.is_active).length

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <PageHeader
        eyebrow="Catálogo"
        title={`${category.emoji ?? '•'} ${category.name}`}
        description={`${activeCount} activos de ${services.length} servicios configurados para esta categoría.`}
        actions={
          <Link
            href="/gestion-x7k2m9/servicios"
            className="rounded-xl border border-slate/15 px-4 py-2 text-sm font-semibold text-slate hover:bg-white"
          >
            Volver
          </Link>
        }
      />

      <ServiceCreateForm categoryId={category.id} />

      <DataTable
        columns={columns}
        rows={services}
        keyExtractor={(r) => String(r.id)}
        emptyMessage="No hay servicios configurados para esta categoría."
      />
    </div>
  )
}
