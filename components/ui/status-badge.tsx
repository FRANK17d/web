const STATUS_STYLES: Record<string, string> = {
  // Verification / technician
  pending: 'bg-warning-50 text-warning-700',
  approved: 'bg-success-50 text-success-700',
  rejected: 'bg-danger-50 text-danger-700',
  suspended: 'bg-surface-200 text-surface-700',
  // Bookings
  confirmed: 'bg-brand-50 text-brand-700',
  in_progress: 'bg-brand-100 text-brand-800',
  completed: 'bg-success-50 text-success-700',
  cancelled: 'bg-danger-50 text-danger-700',
  // Disputes
  open: 'bg-warning-50 text-warning-700',
  under_review: 'bg-brand-50 text-brand-700',
  resolved: 'bg-success-50 text-success-700',
  closed: 'bg-surface-200 text-surface-700',
  // User active state
  active: 'bg-success-50 text-success-700',
  inactive: 'bg-surface-200 text-surface-700',
  // Generic
  true: 'bg-success-50 text-success-700',
  false: 'bg-surface-200 text-surface-700',
}

const LABEL_MAP: Record<string, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  suspended: 'Suspendido',
  confirmed: 'Confirmada',
  in_progress: 'En curso',
  completed: 'Completada',
  cancelled: 'Cancelada',
  open: 'Abierta',
  under_review: 'En revisión',
  resolved: 'Resuelta',
  closed: 'Cerrada',
  active: 'Activo',
  inactive: 'Inactivo',
  true: 'Sí',
  false: 'No',
  admin: 'Admin',
  client: 'Cliente',
  technician: 'Técnico',
  hourly: 'Por hora',
  fixed: 'Fijo',
  quote: 'Cotización',
}

type StatusBadgeProps = {
  status: string
  label?: string
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? 'bg-surface-100 text-surface-600'
  const text = label ?? LABEL_MAP[status] ?? status

  return (
    <span
      className={`inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-semibold ${style}`}
    >
      {text}
    </span>
  )
}
