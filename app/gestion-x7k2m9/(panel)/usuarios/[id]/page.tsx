import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getUserDetail, getTechnicianDetail, getUserRecentOrders } from '@/lib/admin-data/queries'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { ArrowLeft } from 'lucide-react'

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getUserDetail(id)

  if (!user) notFound()

  const isTechnician = user.role === 'technician'
  const techProfile = isTechnician ? await getTechnicianDetail(id) : null
  const recentOrders = await getUserRecentOrders(id)

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Sin nombre'

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <Link
        href="/gestion-x7k2m9/usuarios"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Usuarios
      </Link>

      <PageHeader
        eyebrow="Detalle de usuario"
        title={fullName}
        description={`Registrado el ${new Date(user.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}`}
      />

      {/* User Info Card */}
      <div className="mb-6 rounded-hero border border-slate/10 bg-white p-6 shadow-card">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-eyebrow text-slate">
          Información general
        </h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs font-medium text-slate">Nombre completo</dt>
            <dd className="mt-1 text-sm font-medium text-ink">{fullName}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate">Email</dt>
            <dd className="mt-1 text-sm text-ink">{user.email ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate">Teléfono</dt>
            <dd className="mt-1 text-sm font-mono text-ink">{user.phone ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate">Rol</dt>
            <dd className="mt-1">
              <StatusBadge status={user.role} />
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate">Estado</dt>
            <dd className="mt-1">
              <StatusBadge status={user.is_active ? 'active' : 'inactive'} />
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate">Fecha de registro</dt>
            <dd className="mt-1 text-sm text-ink">
              {new Date(user.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}
            </dd>
          </div>
        </dl>
      </div>

      {/* Technician-specific info */}
      {isTechnician && techProfile && (
        <div className="mb-6 rounded-hero border border-slate/10 bg-white p-6 shadow-card">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-eyebrow text-slate">
            Perfil técnico
          </h2>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-xs font-medium text-slate">Verificación</dt>
              <dd className="mt-1">
                <StatusBadge status={techProfile.verification_status} />
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate">Créditos disponibles</dt>
              <dd className="mt-1 text-sm font-mono font-medium text-ink">
                {techProfile.credits_balance}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate">Distrito</dt>
              <dd className="mt-1 text-sm text-ink">{techProfile.district_name ?? '—'}</dd>
            </div>
            {techProfile.bio && (
              <div className="sm:col-span-2 lg:col-span-3">
                <dt className="text-xs font-medium text-slate">Bio</dt>
                <dd className="mt-1 text-sm text-ink leading-relaxed">{techProfile.bio}</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* Recent Orders */}
      <div className="rounded-hero border border-slate/10 bg-white p-6 shadow-card">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-eyebrow text-slate">
          Pedidos recientes
        </h2>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-slate">No tiene pedidos registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate/10">
                  <th className="whitespace-nowrap pb-2 pr-4 text-xs font-bold uppercase tracking-eyebrow text-slate">Pedido</th>
                  <th className="whitespace-nowrap pb-2 pr-4 text-xs font-bold uppercase tracking-eyebrow text-slate">Rol</th>
                  <th className="whitespace-nowrap pb-2 pr-4 text-xs font-bold uppercase tracking-eyebrow text-slate">Estado</th>
                  <th className="whitespace-nowrap pb-2 text-xs font-bold uppercase tracking-eyebrow text-slate">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate/5">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="whitespace-nowrap py-3 pr-4">
                      <Link
                        href={`/gestion-x7k2m9/reservas/${order.id}`}
                        className="font-medium text-ink underline-offset-2 hover:underline"
                      >
                        {order.title}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap py-3 pr-4">
                      <span className={`inline-flex items-center rounded-pill px-2 py-0.5 text-xs font-semibold ${
                        order.role_in_order === 'client'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-purple-50 text-purple-700'
                      }`}>
                        {order.role_in_order === 'client' ? 'Cliente' : 'Técnico'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-3 pr-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="whitespace-nowrap py-3 text-xs text-slate">
                      {new Date(order.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
