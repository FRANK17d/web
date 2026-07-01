import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DataTable, type Column } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import {
  getServiceCategoryById,
  getServicesByCategoryPage,
  type ServiceItemRow,
} from '@/lib/admin-data/queries'
import { Pagination } from '@/components/ui/pagination'
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
  searchParams,
}: {
  params: Promise<{ categoryId: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { categoryId } = await params
  const { page: pageParam } = await searchParams
  const parsedCategoryId = Number(categoryId)
  const page = Math.max(1, Number.parseInt(pageParam ?? '1', 10) || 1)

  if (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0) {
    notFound()
  }

  const [category, servicesPage] = await Promise.all([
    getServiceCategoryById(parsedCategoryId),
    getServicesByCategoryPage(parsedCategoryId, { page }),
  ])

  if (!category) notFound()

  const services = servicesPage.rows
  const activeCount = services.filter((service) => service.is_active).length
  const rangeStart = servicesPage.total === 0 ? 0 : (page - 1) * servicesPage.pageSize + 1
  const rangeEnd = Math.min(page * servicesPage.pageSize, servicesPage.total)

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <PageHeader
        eyebrow="Catálogo"
        title={`${category.emoji ?? '•'} ${category.name}`}
        description="Administra los servicios específicos que verá el cliente al solicitar ayuda."
        actions={
          <Link
            href="/gestion-x7k2m9/servicios"
            className="rounded-xl border border-slate/15 px-4 py-2 text-sm font-semibold text-slate hover:bg-white"
          >
            Volver
          </Link>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate/10 bg-white p-4 shadow-card">
          <p className="text-xs font-bold uppercase tracking-eyebrow text-slate">Total</p>
          <p className="mt-2 text-2xl font-extrabold text-ink">{servicesPage.total}</p>
          <p className="mt-1 text-xs text-slate">servicios configurados</p>
        </div>
        <div className="rounded-2xl border border-slate/10 bg-white p-4 shadow-card">
          <p className="text-xs font-bold uppercase tracking-eyebrow text-slate">Activos</p>
          <p className="mt-2 text-2xl font-extrabold text-ink">{activeCount}</p>
          <p className="mt-1 text-xs text-slate">en esta página</p>
        </div>
        <div className="rounded-2xl border border-slate/10 bg-white p-4 shadow-card">
          <p className="text-xs font-bold uppercase tracking-eyebrow text-slate">Ruta</p>
          <p className="mt-2 truncate text-lg font-extrabold text-ink">/{category.slug}</p>
          <p className="mt-1 text-xs text-slate">página {page} de {servicesPage.totalPages}</p>
        </div>
      </div>

      <ServiceCreateForm categoryId={category.id} />

      {servicesPage.total > 0 && (
        <p className="mb-3 text-xs font-medium text-slate">
          Mostrando {rangeStart}–{rangeEnd} de {servicesPage.total} servicio{servicesPage.total === 1 ? '' : 's'}
        </p>
      )}

      <DataTable
        columns={columns}
        rows={services}
        keyExtractor={(r) => String(r.id)}
        emptyMessage="No hay servicios configurados para esta categoría."
      />

      <Pagination
        currentPage={page}
        totalPages={servicesPage.totalPages}
        basePath={`/gestion-x7k2m9/servicios/${category.id}`}
      />
    </div>
  )
}
