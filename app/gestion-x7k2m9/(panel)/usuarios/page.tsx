import { getUsers } from '@/lib/admin-data/queries'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable, type Column } from '@/components/ui/data-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { UserToggle } from './user-toggle'

type Row = Awaited<ReturnType<typeof getUsers>>[number]

const columns: Column<Row>[] = [
  {
    key: 'name',
    header: 'Nombre',
    render: (r) => (
      <div>
        <span className="font-medium">
          {[r.first_name, r.last_name].filter(Boolean).join(' ') || '—'}
        </span>
        {r.email && <p className="mt-0.5 text-xs text-neutral-400">{r.email}</p>}
      </div>
    ),
  },
  {
    key: 'phone',
    header: 'Teléfono',
    render: (r) => <span className="text-sm font-mono">{r.phone ?? '—'}</span>,
  },
  {
    key: 'role',
    header: 'Rol',
    render: (r) => <StatusBadge status={r.role} />,
  },
  {
    key: 'active',
    header: 'Estado',
    render: (r) => <StatusBadge status={r.is_active ? 'active' : 'inactive'} />,
  },
  {
    key: 'date',
    header: 'Registro',
    render: (r) => (
      <span className="text-xs text-neutral-500">
        {new Date(r.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
      </span>
    ),
  },
  {
    key: 'actions',
    header: '',
    render: (r) => <UserToggle userId={r.id} isActive={r.is_active} />,
  },
]

export default async function UsuariosPage() {
  const users = await getUsers()

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <PageHeader
        eyebrow="Gestión"
        title="Usuarios"
        description="Todos los usuarios registrados en la plataforma."
      />
      <DataTable columns={columns} rows={users} keyExtractor={(r) => r.id} emptyMessage="No hay usuarios registrados." />
    </div>
  )
}
