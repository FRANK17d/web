import { getCreditPackages, type CreditPackageRow } from '@/lib/admin-data/queries'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable, type Column } from '@/components/ui/data-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { CreditPackageActions, CreditPackageCreateForm } from './package-controls'

const moneyFormatter = new Intl.NumberFormat('es-PE', {
  currency: 'PEN',
  style: 'currency',
})

const columns: Column<CreditPackageRow>[] = [
  {
    key: 'name',
    header: 'Paquete',
    render: (r) => <span className="font-medium">{r.name}</span>,
  },
  {
    key: 'credits',
    header: 'Créditos',
    render: (r) => <span className="text-sm font-bold text-neutral-800">{r.credits}</span>,
  },
  {
    key: 'price',
    header: 'Precio',
    render: (r) => <span className="text-sm text-neutral-600">{moneyFormatter.format(r.price_pen)}</span>,
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
    className: 'min-w-[34rem]',
    render: (r) => <CreditPackageActions pack={r} />,
  },
]

export default async function CreditosPage() {
  const packages = await getCreditPackages()
  const activeCount = packages.filter((pack) => pack.is_active).length

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <PageHeader
        eyebrow="Monetización"
        title="Paquetes de créditos"
        description={`${activeCount} activos de ${packages.length} paquetes configurados. Los pagos reales se conectan después.`}
      />
      <CreditPackageCreateForm />
      <DataTable
        columns={columns}
        rows={packages}
        keyExtractor={(r) => String(r.id)}
        emptyMessage="No hay paquetes de créditos configurados."
      />
    </div>
  )
}
