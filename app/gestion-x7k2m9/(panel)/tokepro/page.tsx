import { getSubscriptionPlans, type SubscriptionPlanRow } from '@/lib/admin-data/queries'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable, type Column } from '@/components/ui/data-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { SubscriptionPlanActions, SubscriptionPlanCreateForm } from './plan-controls'

const moneyFormatter = new Intl.NumberFormat('es-PE', {
  currency: 'PEN',
  style: 'currency',
})

function durationLabel(days: number) {
  if (days % 365 === 0) return `${days / 365} año${days / 365 === 1 ? '' : 's'}`
  if (days % 30 === 0) return `${days / 30} mes${days / 30 === 1 ? '' : 'es'}`
  return `${days} días`
}

const columns: Column<SubscriptionPlanRow>[] = [
  {
    key: 'name',
    header: 'Plan',
    render: (r) => <span className="font-medium">{r.name}</span>,
  },
  {
    key: 'duration',
    header: 'Duración',
    render: (r) => <span className="text-sm text-neutral-600">{durationLabel(r.duration_days)}</span>,
  },
  {
    key: 'price',
    header: 'Precio',
    render: (r) => <span className="text-sm text-neutral-600">{moneyFormatter.format(r.price_pen)}</span>,
  },
  {
    key: 'credits',
    header: 'Créditos',
    render: (r) => <span className="text-sm font-bold text-neutral-800">{r.included_credits}</span>,
  },
  {
    key: 'sort_order',
    header: 'Orden',
    render: (r) => <span className="text-xs text-neutral-500">{r.sort_order}</span>,
  },
  {
    key: 'active',
    header: 'Estado',
    render: (r) => <StatusBadge status={r.is_active ? 'active' : 'inactive'} />,
  },
  {
    key: 'actions',
    header: '',
    className: 'min-w-[44rem]',
    render: (r) => <SubscriptionPlanActions plan={r} />,
  },
]

export default async function TokeProPage() {
  const plans = await getSubscriptionPlans()
  const activeCount = plans.filter((plan) => plan.is_active).length

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <PageHeader
        eyebrow="Monetización"
        title="Planes TokePro"
        description={`${activeCount} activos de ${plans.length} planes configurados. La compra real se conecta después.`}
      />
      <SubscriptionPlanCreateForm />
      <DataTable
        columns={columns}
        rows={plans}
        keyExtractor={(r) => String(r.id)}
        emptyMessage="No hay planes TokePro configurados."
      />
    </div>
  )
}
