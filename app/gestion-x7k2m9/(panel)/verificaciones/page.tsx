import { getTechnicianVerifications } from '@/lib/admin-data/queries'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable, type Column } from '@/components/ui/data-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { VerificationActions } from './verification-actions'

type Row = Awaited<ReturnType<typeof getTechnicianVerifications>>[number]

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  verified: 'Verificado',
  rejected: 'Rechazado',
}

const DOC_LABELS: Record<string, string> = {
  dni_front: 'DNI frontal',
  dni_back: 'DNI reverso',
  selfie: 'Selfie',
  certificate: 'Certificado',
}

const columns: Column<Row>[] = [
  {
    key: 'name',
    header: 'Técnico',
    render: (r) => (
      <div>
        <span className="font-medium">{r.first_name} {r.last_name}</span>
        {r.email && <p className="mt-0.5 text-xs text-neutral-400">{r.email}</p>}
      </div>
    ),
  },
  {
    key: 'dni',
    header: 'DNI',
    render: (r) => <span className="text-sm font-mono">{r.dni_number ?? '—'}</span>,
  },
  {
    key: 'specialty',
    header: 'Especialidad',
    render: (r) => <span className="text-sm text-neutral-600">{r.specialty ?? '—'}</span>,
  },
  {
    key: 'district',
    header: 'Distrito',
    render: (r) => <span className="text-sm text-neutral-600">{r.district_name}</span>,
  },
  {
    key: 'documents',
    header: 'Documentos',
    className: 'min-w-56 whitespace-normal',
    render: (r) =>
      r.documents.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {r.documents.map((doc) => (
            <a
              key={`${doc.doc_type}:${doc.file_path}`}
              href={doc.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
            >
              {DOC_LABELS[doc.doc_type] ?? doc.doc_type}
            </a>
          ))}
        </div>
      ) : (
        <span className="text-xs text-neutral-400">Sin documentos</span>
      ),
  },
  {
    key: 'status',
    header: 'Estado',
    render: (r) => (
      <StatusBadge
        status={r.verification_status}
        label={STATUS_LABELS[r.verification_status] ?? r.verification_status}
      />
    ),
  },
  {
    key: 'date',
    header: 'Registro',
    render: (r) => (
      <span className="text-xs text-neutral-500">
        {new Date(r.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
      </span>
    ),
  },
  {
    key: 'actions',
    header: '',
    render: (r) =>
      r.verification_status === 'pending' ? (
        <VerificationActions techProfileId={r.id} name={`${r.first_name} ${r.last_name}`} />
      ) : null,
  },
]

export default async function VerificacionesPage() {
  const techs = await getTechnicianVerifications()

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <PageHeader
        eyebrow="Verificaciones"
        title="Verificaciones de técnicos"
        description="Revisa y aprueba la identidad de los técnicos para que puedan postular."
      />
      <DataTable
        columns={columns}
        rows={techs}
        keyExtractor={(r) => r.id}
        emptyMessage="No hay técnicos pendientes de verificación."
      />
    </div>
  )
}
