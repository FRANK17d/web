import type { LucideIcon } from 'lucide-react'

type StatCardProps = {
  label: string
  value: string | number
  icon: LucideIcon
  detail?: string
  trend?: 'up' | 'down' | 'neutral'
}

export function StatCard({ label, value, icon: Icon, detail, trend }: StatCardProps) {
  return (
    <div className="group rounded-2xl border border-neutral-100 bg-white p-7 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-800">
            {typeof value === 'number' ? value.toLocaleString('es-PE') : value}
          </p>
          {detail && (
            <p className="mt-1 text-xs text-neutral-400">
              {trend === 'up' && <span className="text-green-500 mr-1">+</span>}
              {trend === 'down' && <span className="text-red-500 mr-1">-</span>}
              {detail}
            </p>
          )}
        </div>
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#EE7070]/10">
          <Icon className="h-5 w-5 text-[#EE7070]" />
        </div>
      </div>
    </div>
  )
}
