import { Wrench } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-surface-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand">
              <Wrench className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-surface-900">
              Maestro<span className="text-brand-600">Ya</span>
            </span>
          </div>

          <p className="text-sm text-surface-500">
            © {new Date().getFullYear()} MaestroYa. Todos los derechos reservados. Lima, Perú.
          </p>
        </div>
      </div>
    </footer>
  )
}
