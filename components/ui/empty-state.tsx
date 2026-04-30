import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'

type EmptyStateProps = {
  icon?: LucideIcon
  title: string
  description?: string
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-hero border border-dashed border-slate/30 bg-canvas px-8 py-16 text-center">
      <Icon className="mb-4 h-10 w-10 text-slate/50" />
      <p className="text-sm font-medium text-ink">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-slate">{description}</p>
      )}
    </div>
  )
}
