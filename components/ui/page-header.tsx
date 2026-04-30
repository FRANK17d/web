import type { ReactNode } from 'react'

type PageHeaderProps = {
  eyebrow: string
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h1 className="text-3xl font-medium tracking-headline text-ink">{title}</h1>
        {description && (
          <p className="mt-2 max-w-lg text-sm text-slate leading-relaxed">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
