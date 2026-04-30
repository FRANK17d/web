import { adminGet, type ApiPaginated, type ApiOk } from '@/lib/admin-api'
import { DataTable, type Column } from '@/components/ui/data-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { Pagination } from '@/components/ui/pagination'
import { PageHeader } from '@/components/ui/page-header'
import { SearchInput } from '@/components/ui/search-input'
import { FilterSelect } from '@/components/ui/filter-select'

type ServiceRow = {
  id: string
  category_id: string
  name: string
  slug: string
  description: string | null
  price_type: 'hourly' | 'fixed' | 'quote'
  suggested_min_price: number
  suggested_max_price: number
  estimated_minutes: number | null
  is_active: boolean
  created_at: string
}

type CategoryRow = {
  id: string
  name: string
  slug: string
  is_active: boolean
}

type Props = {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function ServiciosPage({ searchParams }: Props) {
  const sp = await searchParams
  const page = Number(sp.page) || 1
  const search = sp.search ?? ''
  const category_id = sp.category_id ?? ''
  const active = sp.active ?? ''

  const [servicesRes, categoriesRes] = await Promise.all([
    adminGet<ApiPaginated<ServiceRow>>('/api/admin/services', {
      page,
      limit: 20,
      search: search || undefined,
      category_id: category_id || undefined,
      active: active || undefined,
    }),
    adminGet<ApiOk<CategoryRow[]>>('/api/admin/categories'),
  ])

  const categories = categoriesRes.datos

  const formatPrice = (n: number) => `S/ ${n.toFixed(2)}`

  const columns: Column<ServiceRow>[] = [
    {
      key: 'name',
      header: 'Nombre',
      render: (r) => <span className="font-medium">{r.name}</span>,
    },
    {
      key: 'category',
      header: 'Categoría',
      render: (r) => {
        const cat = categories.find((c) => c.id === r.category_id)
        return <span className="text-slate">{cat?.name ?? '—'}</span>
      },
    },
    {
      key: 'price_type',
      header: 'Tipo precio',
      render: (r) => <StatusBadge status={r.price_type} />,
    },
    {
      key: 'price_range',
      header: 'Rango',
      render: (r) =>
        `${formatPrice(r.suggested_min_price)} – ${formatPrice(r.suggested_max_price)}`,
    },
    {
      key: 'active',
      header: 'Activo',
      render: (r) => (
        <StatusBadge status={r.is_active ? 'active' : 'inactive'} />
      ),
    },
    {
      key: 'created',
      header: 'Creado',
      render: (r) => new Date(r.created_at).toLocaleDateString('es-PE'),
    },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Catálogo"
        title="Servicios"
        description="Gestiona los servicios y categorías disponibles en la plataforma."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="w-full max-w-xs">
          <SearchInput placeholder="Buscar servicio..." defaultValue={search} />
        </div>
        <FilterSelect
          paramName="category_id"
          label="Todas las categorías"
          defaultValue={category_id}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
        <FilterSelect
          paramName="active"
          label="Todos los estados"
          defaultValue={active}
          options={[
            { value: 'true', label: 'Activo' },
            { value: 'false', label: 'Inactivo' },
          ]}
        />
      </div>

      <DataTable
        columns={columns}
        rows={servicesRes.datos}
        keyExtractor={(r) => r.id}
        emptyMessage="No hay servicios registrados."
      />

      <Pagination
        currentPage={servicesRes.paginacion.pagina}
        totalPages={servicesRes.paginacion.totalPaginas}
        basePath="/administracion/servicios"
        searchParams={{ search, category_id, active }}
      />
    </div>
  )
}
