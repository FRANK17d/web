import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { getRequestApplications, getServiceRequestDetail } from '@/lib/admin-data/queries'
import { RequestActions } from '../request-actions'

const moneyFormatter = new Intl.NumberFormat('es-PE', {
  currency: 'PEN',
  style: 'currency',
})

const dateFormatter = new Intl.DateTimeFormat('es-PE', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const STATUS_LABELS: Record<string, string> = {
  pending_review: 'En revisión',
  open: 'Abierto',
  assigned: 'Asignado',
  in_progress: 'En curso',
  completed: 'Completado',
  cancelled: 'Cancelado',
  rejected: 'Rechazado',
}

function moneyRange(min: number | null, max: number | null) {
  if (min !== null && max !== null) return `${moneyFormatter.format(min)} - ${moneyFormatter.format(max)}`
  if (min !== null) return `Desde ${moneyFormatter.format(min)}`
  if (max !== null) return `Hasta ${moneyFormatter.format(max)}`
  return 'Sin presupuesto'
}

export default async function PedidoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [request, applications] = await Promise.all([
    getServiceRequestDetail(id),
    getRequestApplications(id),
  ])

  if (!request) notFound()

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <PageHeader
        eyebrow="Pedido"
        title={request.title}
        description={`${request.category_emoji ?? ''} ${request.category_name ?? 'Servicio'} · ${request.district_name ?? 'Sin distrito'}`}
        actions={
          <Link
            href="/gestion-x7k2m9/reservas"
            className="rounded-xl border border-slate/15 px-4 py-2 text-sm font-semibold text-slate hover:bg-white"
          >
            Volver
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="rounded-hero border border-slate/10 bg-white p-6 shadow-card">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <StatusBadge status={request.status} label={STATUS_LABELS[request.status] ?? request.status} />
            <span className="text-xs font-semibold text-slate">
              Creado {dateFormatter.format(new Date(request.created_at))}
            </span>
          </div>

          <h2 className="mb-3 text-lg font-bold text-ink">Descripción</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate">
            {request.description || 'Sin descripción.'}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Detail label="Cliente" value={request.client_name ?? 'Sin nombre'} />
            <Detail label="Distrito" value={request.district_name ?? 'Sin distrito'} />
            <Detail label="Dirección" value={request.address ?? 'No indicada'} />
            <Detail label="Presupuesto" value={moneyRange(request.budget_min, request.budget_max)} />
            <Detail
              label="Fecha preferida"
              value={request.preferred_date ? dateFormatter.format(new Date(request.preferred_date)) : 'No indicada'}
            />
            <Detail label="Comprobante" value={request.needs_invoice ? 'Solicita factura/boleta' : 'No solicita'} />
          </div>

          {request.status === 'pending_review' && (
            <div className="mt-6 border-t border-slate/10 pt-5">
              <RequestActions requestId={request.id} title={request.title} />
            </div>
          )}
        </section>

        <aside className="rounded-hero border border-slate/10 bg-white p-6 shadow-card">
          <h2 className="text-lg font-bold text-ink">Postulantes</h2>
          <p className="mt-1 text-sm text-slate">{applications.length} postulaciones recibidas.</p>

          <div className="mt-5 space-y-3">
            {applications.length === 0 ? (
              <p className="rounded-2xl bg-canvas px-4 py-5 text-sm text-slate">
                Aún no hay técnicos postulados para este pedido.
              </p>
            ) : (
              applications.map((application) => (
                <div key={application.application_id} className="rounded-2xl border border-slate/10 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink">
                        {[application.first_name, application.last_name].filter(Boolean).join(' ') || 'Técnico'}
                      </p>
                      <p className="mt-1 text-xs text-slate">
                        {application.avg_rating ? `${application.avg_rating.toFixed(1)} estrellas` : 'Sin rating'} · {application.total_jobs_completed ?? 0} trabajos
                      </p>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>
                  {application.proposed_price !== null && (
                    <p className="mt-3 text-sm font-bold text-ink">
                      {moneyFormatter.format(application.proposed_price)}
                    </p>
                  )}
                  {application.message && (
                    <p className="mt-2 text-sm leading-relaxed text-slate">{application.message}</p>
                  )}
                </div>
              ))
            )}
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
