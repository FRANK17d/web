import { getReviews, type ReviewRow } from '@/lib/admin-data/queries'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable, type Column } from '@/components/ui/data-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { Pagination } from '@/components/ui/pagination'
import { ReviewToggle } from './review-toggle'

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`text-sm ${i < rating ? 'text-amber-400' : 'text-neutral-200'}`}
        >
          &#9733;
        </span>
      ))}
    </span>
  )
}

const columns: Column<ReviewRow>[] = [
  {
    key: 'client',
    header: 'Cliente',
    render: (r) => <span className="text-sm font-medium text-ink">{r.client_name}</span>,
  },
  {
    key: 'technician',
    header: 'Técnico',
    render: (r) => <span className="text-sm">{r.technician_name}</span>,
  },
  {
    key: 'rating',
    header: 'Calificación',
    render: (r) => <StarRating rating={r.rating} />,
  },
  {
    key: 'comment',
    header: 'Comentario',
    className: 'max-w-[240px]',
    render: (r) => (
      <span className="block max-w-[240px] truncate text-xs text-slate">
        {r.comment || '—'}
      </span>
    ),
  },
  {
    key: 'date',
    header: 'Fecha',
    render: (r) => (
      <span className="text-xs text-slate">
        {new Date(r.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
      </span>
    ),
  },
  {
    key: 'visibility',
    header: 'Visible',
    render: (r) => (
      <StatusBadge
        status={r.is_visible ? 'active' : 'inactive'}
        label={r.is_visible ? 'Visible' : 'Oculta'}
      />
    ),
  },
  {
    key: 'actions',
    header: '',
    render: (r) => <ReviewToggle reviewId={r.id} isVisible={r.is_visible} />,
  },
]

export default async function ResenasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number.parseInt(pageParam ?? '1', 10) || 1)

  const { rows, total, totalPages, pageSize } = await getReviews({ page })

  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, total)

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <PageHeader
        eyebrow="Moderación"
        title="Reseñas"
        description="Gestiona la visibilidad de las reseñas dejadas por los clientes."
      />

      {total > 0 && (
        <p className="mb-3 text-xs font-medium text-slate">
          Mostrando {rangeStart}–{rangeEnd} de {total} reseña{total === 1 ? '' : 's'}
        </p>
      )}

      <DataTable
        columns={columns}
        rows={rows}
        keyExtractor={(r) => r.id}
        emptyMessage="No hay reseñas registradas."
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/gestion-x7k2m9/resenas"
      />
    </div>
  )
}
