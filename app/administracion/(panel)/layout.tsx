import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'
import { getAdminSession } from '@/lib/admin-auth/server'

export default async function AdministracionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getAdminSession()

  if (!admin) {
    redirect('/administracion/iniciar-sesion')
  }

  return (
    <div className="flex min-h-screen bg-surface-50">
      <AdminSidebar userName={admin.nombreCompleto} />
      <main id="main-content" className="ml-64 flex-1 p-8">{children}</main>
    </div>
  )
}
