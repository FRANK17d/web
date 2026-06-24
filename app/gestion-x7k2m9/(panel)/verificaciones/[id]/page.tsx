import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { getTechnicianVerificationDetail } from '@/lib/admin-data/queries'
import { VerificationActions } from '../verification-actions'
import { DocViewer } from '../doc-viewer'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  verified: 'Verificado',
  rejected: 'Rechazado',
}

const DOC_LABELS: Record<string, string> = {
  dni_front: 'DNI frontal',
  dni_back: 'DNI reverso',
  selfie: 'Selfie',
  certificate: 'Certificado de estudios',
}

const dateFormatter = new Intl.DateTimeFormat('es-PE', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export default async function VerificacionDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const tech = await getTechnicianVerificationDetail(id)

  if (!tech) notFound()

  const fullName = `${tech.first_name} ${tech.last_name}`.trim() || 'Técnico'
  const viewerDocs = tech.documents.map((d) => ({
    label: DOC_LABELS[d.doc_type] ?? d.doc_type,
    url: d.url,
    status: d.status,
  }))

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <PageHeader
        eyebrow="Verificación"
        title={fullName}
        description={`${tech.specialty ?? 'Técnico'} · ${tech.district_name || 'Sin distrito'}`}
        actions={
          <Link
            href="/gestion-x7k2m9/verificaciones"
            className="rounded-xl border border-slate/15 px-4 py-2 text-sm font-semibold text-slate hover:bg-white"
          >
            Volver
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* ── Documentos ── */}
        <section className="rounded-hero border border-slate/10 bg-white p-6 shadow-card">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-ink">Documentos</h2>
            <StatusBadge
              status={tech.verification_status}
              label={STATUS_LABELS[tech.verification_status] ?? tech.verification_status}
            />
          </div>

          <DocViewer docs={viewerDocs} />

          {tech.verification_status === 'rejected' && tech.rejection_reason && (
            <div className="mt-5 rounded-2xl border border-danger-700/15 bg-danger-50 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-eyebrow text-danger-700">
                Motivo del rechazo
              </p>
              <p className="mt-1 text-sm text-ink">{tech.rejection_reason}</p>
            </div>
          )}

          {tech.verification_status === 'pending' && (
            <div className="mt-6 border-t border-slate/10 pt-5">
              <p className="mb-3 text-sm text-slate">
                Revisa los documentos y decide:
              </p>
              <VerificationActions techProfileId={tech.id} name={fullName} />
            </div>
          )}
        </section>

        {/* ── Datos del técnico ── */}
        <aside className="rounded-hero border border-slate/10 bg-white p-6 shadow-card">
          <h2 className="mb-4 text-lg font-bold text-ink">Datos</h2>
          <dl className="space-y-3">
            <Detail label="DNI" value={tech.dni_number ?? '—'} mono />
            <Detail label="Especialidad / oficio" value={tech.specialty ?? '—'} />
            <Detail label="Distrito" value={tech.district_name || '—'} />
            <Detail label="Correo" value={tech.email ?? '—'} />
            <Detail label="Teléfono" value={tech.phone ?? '—'} />
            <Detail
              label="Registro"
              value={dateFormatter.format(new Date(tech.created_at))}
            />
          </dl>
        </aside>
      </div>
    </div>
  )
}

function Detail({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="rounded-2xl bg-canvas px-4 py-3">
      <dt className="text-xs font-bold uppercase tracking-eyebrow text-slate">{label}</dt>
      <dd className={`mt-1 text-sm font-semibold text-ink ${mono ? 'font-mono' : ''}`}>
        {value}
      </dd>
    </div>
  )
}
