import { DataTable, type Column } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { getSupportTickets, type SupportTicketRow } from '@/lib/admin-data/queries'
import { TicketStatusActions } from './ticket-status-actions'
import Link from 'next/link'

const dateFormatter = new Intl.DateTimeFormat('es-PE', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const priorityLabels: Record<string, string> = {
  low: 'Baja',
  normal: 'Normal',
  high: 'Alta',
}

const columns: Column<SupportTicketRow>[] = [
  {
    key: 'subject',
    header: 'Ticket',
    render: (r) => (
      <div>
        <p className="font-medium text-ink">{r.subject}</p>
        <p className="mt-1 text-xs text-slate">{r.category ?? 'general'}</p>
      </div>
    ),
  },
  {
    key: 'user',
    header: 'Usuario',
    render: (r) => (
      <div>
        <p className="text-sm text-ink">{r.user_name}</p>
        {r.user_email && <p className="mt-1 text-xs text-slate">{r.user_email}</p>}
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Estado',
    render: (r) => <StatusBadge status={r.status} />,
  },
  {
    key: 'priority',
    header: 'Prioridad',
    render: (r) => <span className="text-sm text-neutral-600">{priorityLabels[r.priority] ?? r.priority}</span>,
  },
  {
    key: 'updated',
    header: 'Actualizado',
    render: (r) => <span className="text-xs text-slate">{dateFormatter.format(new Date(r.updated_at))}</span>,
  },
  {
    key: 'actions',
    header: '',
    className: 'min-w-[24rem]',
    render: (r) => (
      <div className="flex items-center gap-2">
        <Link
          href={`/gestion-x7k2m9/disputas/${r.id}`}
          className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
        >
          Ver detalle
        </Link>
        <TicketStatusActions ticketId={r.id} status={r.status} subject={r.subject} />
      </div>
    ),
  },
]

export default async function DisputasPage() {
  const tickets = await getSupportTickets()
  const openCount = tickets.filter((ticket) => ticket.status !== 'closed').length

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <PageHeader
        eyebrow="Soporte"
        title="Tickets de soporte"
        description={`${openCount} tickets abiertos o en seguimiento de ${tickets.length} registrados.`}
      />
      <DataTable
        columns={columns}
        rows={tickets}
        keyExtractor={(r) => r.id}
        emptyMessage="No hay tickets de soporte registrados."
      />
    </div>
  )
}
