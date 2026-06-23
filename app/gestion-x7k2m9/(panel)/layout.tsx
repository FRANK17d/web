import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-auth/server'
import { AdminShell } from './admin-shell'

export default async function AdministracionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getAdminSession()

  if (!admin) {
    redirect('/gestion-x7k2m9/iniciar-sesion')
  }

  return <AdminShell userName={admin.nombreCompleto}>{children}</AdminShell>
}
