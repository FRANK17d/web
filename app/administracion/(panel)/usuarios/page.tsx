import { adminGet, type ApiPaginated } from '@/lib/admin-api'
import { DataTable, type Column } from '@/components/ui/data-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { Pagination } from '@/components/ui/pagination'
import { PageHeader } from '@/components/ui/page-header'
import { SearchInput } from '@/components/ui/search-input'
import { FilterSelect } from '@/components/ui/filter-select'

type UserRow = {
  id: string
  email: string
  first_name: string
  last_name: string
  role: 'admin' | 'client' | 'technician'
  is_active: boolean
  last_login_at: string | null
  created_at: string
}

type Props = {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function UsuariosPage({ searchParams }: Props) {
  const sp = await searchParams
  const page = Number(sp.page) || 1
  const search = sp.search ?? ''
  const role = sp.role ?? ''
  const active = sp.active ?? ''

  const res = await adminGet<ApiPaginated<UserRow>>('/api/admin/users', {
    page,
    limit: 20,
    search: search || undefined,
    role: role || undefined,
    active: active || undefined,
  })

  const columns: Column<UserRow>[] = [
    {
      key: 'name',
      header: 'Nombre',
      render: (r) => (
        <span className="font-medium">
          {r.first_name} {r.last_name}
        </span>
      ),
    },
    { key: 'email', header: 'Email', render: (r) => r.email },
    {
      key: 'role',
      header: 'Rol',
      render: (r) => <StatusBadge status={r.role} />,
    },
    {
      key: 'active',
      header: 'Estado',
      render: (r) => (
        <StatusBadge status={r.is_active ? 'active' : 'inactive'} />
      ),
    },
    {
      key: 'last_login',
      header: 'Último ingreso',
      render: (r) =>
        r.last_login_at
          ? new Date(r.last_login_at).toLocaleDateString('es-PE')
          : '—',
    },
    {
      key: 'created',
      header: 'Registrado',
      render: (r) => new Date(r.created_at).toLocaleDateString('es-PE'),
    },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Gestión"
        title="Usuarios"
        description="Administra todos los usuarios registrados en la plataforma."
      />

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="w-full max-w-xs">
          <SearchInput placeholder="Buscar por nombre o email..." defaultValue={search} />
        </div>
        <FilterSelect
          paramName="role"
          label="Todos los roles"
          defaultValue={role}
          options={[
            { value: 'admin', label: 'Admin' },
            { value: 'client', label: 'Cliente' },
            { value: 'technician', label: 'Técnico' },
          ]}
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
        rows={res.datos}
        keyExtractor={(r) => r.id}
        emptyMessage="No se encontraron usuarios."
      />

      <Pagination
        currentPage={res.paginacion.pagina}
        totalPages={res.paginacion.totalPaginas}
        basePath="/administracion/usuarios"
        searchParams={{ search, role, active }}
      />
    </div>
  )
}
