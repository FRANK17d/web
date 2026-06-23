'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  CalendarDays,
  CreditCard,
  Crown,
  Wrench as WrenchIcon,
  AlertTriangle,
  BarChart3,
  Settings,
  X,
} from 'lucide-react'
import { AdminLogoutButton } from '@/components/admin/logout-button'

const navItems = [
  { href: '/gestion-x7k2m9', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/gestion-x7k2m9/usuarios', label: 'Usuarios', icon: Users },
  { href: '/gestion-x7k2m9/verificaciones', label: 'Verificaciones', icon: ShieldCheck },
  { href: '/gestion-x7k2m9/reservas', label: 'Pedidos', icon: CalendarDays },
  { href: '/gestion-x7k2m9/servicios', label: 'Servicios', icon: WrenchIcon },
  { href: '/gestion-x7k2m9/creditos', label: 'Créditos', icon: CreditCard },
  { href: '/gestion-x7k2m9/tokepro', label: 'TokePro', icon: Crown },
  { href: '/gestion-x7k2m9/disputas', label: 'Soporte', icon: AlertTriangle },
  { href: '/gestion-x7k2m9/reportes', label: 'Reportes', icon: BarChart3 },
  { href: '/gestion-x7k2m9/configuracion', label: 'Configuración', icon: Settings },
]

export function AdminSidebar({
  userName,
  open = false,
  onClose,
}: {
  userName: string
  open?: boolean
  onClose?: () => void
}) {
  const pathname = usePathname()

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-100 bg-white transition-transform duration-300 ease-out md:translate-x-0 ${
        open ? 'translate-x-0 shadow-card' : '-translate-x-full'
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-neutral-100 px-6">
        <Image
          src="/toke-logo.svg"
          alt="toke+"
          width={90}
          height={34}
          style={{ width: 90, height: 'auto' }}
          priority
        />
        <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
          Admin
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar menú"
          className="-mr-2 ml-auto rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 md:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/gestion-x7k2m9' && pathname.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#EE7070] text-white shadow-md shadow-[#EE7070]/20'
                      : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'
                  }`}
                >
                  <item.icon
                    className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-neutral-400'}`}
                  />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User + Logout */}
      <div className="border-t border-neutral-100 bg-neutral-50/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#EE7070] text-sm font-semibold text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-neutral-800">{userName}</p>
            <p className="text-xs text-neutral-400">Administrador</p>
          </div>
          <AdminLogoutButton />
        </div>
      </div>
    </aside>
  )
}
