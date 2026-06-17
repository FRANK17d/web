import type { LucideIcon } from 'lucide-react'
import { Hammer } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'

type ModulePendingProps = {
  eyebrow: string
  title: string
  description: string
  icon?: LucideIcon
  note?: string
}

// Vista para los módulos del panel que aún no tienen origen de datos.
// No hace ninguna llamada de red: cada módulo se conectará a Insforge
// cuando se implemente su capa de datos.
export function ModulePending({
  eyebrow,
  title,
  description,
  icon: Icon = Hammer,
  note = 'Este módulo aún no está conectado a un origen de datos.',
}: ModulePendingProps) {
  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      <div className="flex flex-col items-center justify-center rounded-hero border border-dashed border-slate/30 bg-canvas px-8 py-16 text-center">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate shadow-card">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="text-sm font-medium text-ink">Módulo en preparación</p>
        <p className="mt-1.5 max-w-md text-xs leading-5 text-slate">{note}</p>
      </div>
    </div>
  )
}
