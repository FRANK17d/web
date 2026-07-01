import Link from 'next/link'
import { getServiceCategoriesPage, type ServiceCategoryRow } from '@/lib/admin-data/queries'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable, type Column } from '@/components/ui/data-table'
import { Pagination } from '@/components/ui/pagination'
import { StatusBadge } from '@/components/ui/status-badge'
import { CategoryActions, CategoryCreateForm } from './category-controls'

const columns: Column<ServiceCategoryRow>[] = [
  {
    key: 'name',
    header: 'Categoría',
    render: (r) => (
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-canvas text-xl">
          {r.emoji ?? '•'}
        </span>
        <div className="min-w-0">
          <span className="block truncate font-semibold text-ink">{r.name}</span>
          <p className="mt-0.5 truncate text-xs text-neutral-400">/{r.slug}</p>
        </div>
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
    className: 'min-w-96',
    render: (r) => (
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/gestion-x7k2m9/servicios/${r.id}`}
          className="rounded-lg bg-[#EE7070] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#d95f5f]"
        >
          Servicios
        </Link>
        <CategoryActions category={r} />
      </div>
    ),
  },
]

export default async function ServiciosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number.parseInt(pageParam ?? '1', 10) || 1)
  const { rows: categories, total, totalPages, pageSize } = await getServiceCategoriesPage({ page })
  const activeCount = categories.filter((category) => category.is_active).length
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, total)

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <PageHeader
        eyebrow="Catálogo"
        title="Categorías de servicio"
        description="Organiza el catálogo visible para clientes y técnicos. Cada categoría agrupa servicios específicos."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate/10 bg-white p-4 shadow-card">
          <p className="text-xs font-bold uppercase tracking-eyebrow text-slate">Total</p>
          <p className="mt-2 text-2xl font-extrabold text-ink">{total}</p>
          <p className="mt-1 text-xs text-slate">categorías configuradas</p>
        </div>
        <div className="rounded-2xl border border-slate/10 bg-white p-4 shadow-card">
          <p className="text-xs font-bold uppercase tracking-eyebrow text-slate">Activas</p>
          <p className="mt-2 text-2xl font-extrabold text-ink">{activeCount}</p>
          <p className="mt-1 text-xs text-slate">en esta página</p>
        </div>
        <div className="rounded-2xl border border-slate/10 bg-white p-4 shadow-card">
          <p className="text-xs font-bold uppercase tracking-eyebrow text-slate">Página</p>
          <p className="mt-2 text-2xl font-extrabold text-ink">{page}</p>
          <p className="mt-1 text-xs text-slate">de {totalPages}</p>
        </div>
      </div>

      <CategoryCreateForm />

      {total > 0 && (
        <p className="mb-3 text-xs font-medium text-slate">
          Mostrando {rangeStart}–{rangeEnd} de {total} categoría{total === 1 ? '' : 's'}
        </p>
      )}

      <DataTable
        columns={columns}
        rows={categories}
        keyExtractor={(r) => String(r.id)}
        emptyMessage="No hay categorías configuradas."
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/gestion-x7k2m9/servicios"
      />
    </div>
  )
}
