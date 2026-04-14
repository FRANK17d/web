'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  CalendarDays,
  Wrench as WrenchIcon,
  AlertTriangle,
  BarChart3,
  Settings,
} from 'lucide-react'
import { AdminLogoutButton } from '@/components/admin/logout-button'

const navItems = [
  { href: '/administracion', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/administracion/usuarios', label: 'Usuarios', icon: Users },
  { href: '/administracion/verificaciones', label: 'Verificaciones', icon: ShieldCheck },
  { href: '/administracion/reservas', label: 'Reservas', icon: CalendarDays },
  { href: '/administracion/servicios', label: 'Servicios', icon: WrenchIcon },
  { href: '/administracion/disputas', label: 'Disputas', icon: AlertTriangle },
  { href: '/administracion/reportes', label: 'Reportes', icon: BarChart3 },
  { href: '/administracion/configuracion', label: 'Configuración', icon: Settings },
]

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-surface-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-surface-200 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand">
          <WrenchIcon className="h-4 w-4 text-white" />
        </div>
        <div>
          <span className="text-lg font-bold text-surface-900">
            Maestro<span className="text-brand-600">Ya</span>
          </span>
          <p className="text-[10px] font-medium uppercase tracking-wider text-surface-400">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/administracion' && pathname.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 shadow-sm'
                      : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-brand-600' : 'text-surface-400'}`} />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User + Logout */}
      <div className="border-t border-surface-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-surface-900">{userName}</p>
            <p className="text-xs text-surface-500">Administrador</p>
          </div>
          <AdminLogoutButton />
        </div>
      </div>
    </aside>
  )
}
