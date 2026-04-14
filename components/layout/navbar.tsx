import Link from 'next/link'
import { Wrench } from 'lucide-react'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 glass">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand shadow-sm">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-surface-900">
            Maestro<span className="text-brand-600">Ya</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="#servicios" className="text-sm font-medium text-surface-600 transition-colors hover:text-brand-600">
            Servicios
          </Link>
          <Link href="#como-funciona" className="text-sm font-medium text-surface-600 transition-colors hover:text-brand-600">
            Cómo funciona
          </Link>
          <Link href="/auth" className="text-sm font-medium text-surface-600 transition-colors hover:text-brand-600">
            Acceso
          </Link>
          <Link href="/administracion/iniciar-sesion" className="btn-primary text-sm px-5 py-2.5">
            Admin
          </Link>
        </div>
      </nav>
    </header>
  )
}
