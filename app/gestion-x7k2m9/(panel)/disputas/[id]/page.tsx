import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { getSupportTicketDetail, getSupportTicketMessages } from '@/lib/admin-data/queries'
import { TicketStatusActions } from '../ticket-status-actions'
import { TicketReplyForm } from './ticket-reply-form'

const dateFormatter = new Intl.DateTimeFormat('es-PE', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const STATUS_LABELS: Record<string, string> = {
  open: 'Abierto',
  in_progress: 'En seguimiento',
  closed: 'Cerrado',
}

export default async function TicketDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [ticket, messages] = await Promise.all([
    getSupportTicketDetail(id),
    getSupportTicketMessages(id),
  ])

  if (!ticket) notFound()

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <PageHeader
        eyebrow="Soporte"
        title={ticket.subject}
        description={`${ticket.user_name} · ${ticket.category ?? 'general'}`}
        actions={
          <Link
            href="/gestion-x7k2m9/disputas"
            className="rounded-xl border border-slate/15 px-4 py-2 text-sm font-semibold text-slate hover:bg-white"
          >
            Volver
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="rounded-hero border border-slate/10 bg-white p-6 shadow-card">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={ticket.status} label={STATUS_LABELS[ticket.status] ?? ticket.status} />
              <span className="text-xs font-semibold text-slate">
                Actualizado {dateFormatter.format(new Date(ticket.updated_at))}
              </span>
            </div>
            <TicketStatusActions ticketId={ticket.id} status={ticket.status} subject={ticket.subject} />
          </div>

          <h2 className="text-lg font-bold text-ink">Conversación</h2>
          <div className="mt-5 space-y-4">
            {messages.length === 0 ? (
              <p className="rounded-2xl bg-canvas px-4 py-5 text-sm text-slate">
                Este ticket todavía no tiene mensajes.
              </p>
            ) : (
              messages.map((message) => (
                <article
                  key={message.id}
                  className={`rounded-2xl border px-4 py-3 ${
                    message.is_admin
                      ? 'border-brand-100 bg-brand-50/60'
                      : 'border-slate/10 bg-canvas'
                  }`}
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-ink">{message.sender_name}</p>
                    <time className="text-xs text-slate">
                      {dateFormatter.format(new Date(message.created_at))}
                    </time>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate">{message.body}</p>
                </article>
              ))
            )}
          </div>

          <div className="mt-6 border-t border-slate/10 pt-5">
            <TicketReplyForm ticketId={ticket.id} disabled={ticket.status === 'closed'} />
          </div>
        </section>

        <aside className="rounded-hero border border-slate/10 bg-white p-6 shadow-card">
          <h2 className="text-lg font-bold text-ink">Datos del ticket</h2>
          <div className="mt-5 space-y-3">
            <Detail label="Usuario" value={ticket.user_name} />
            <Detail label="Correo" value={ticket.user_email ?? 'No registrado'} />
            <Detail label="Categoría" value={ticket.category ?? 'general'} />
            <Detail label="Prioridad" value={ticket.priority} />
            <Detail label="Creado" value={dateFormatter.format(new Date(ticket.created_at))} />
          </div>
        </aside>
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-canvas px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-eyebrow text-slate">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  )
}
