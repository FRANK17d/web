import { ClipboardCheck, Database, Fingerprint } from 'lucide-react'
import { getAdminAuditLogs, type AdminAuditLogRow } from '@/lib/admin-data/queries'
import { DataTable, type Column } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { Pagination } from '@/components/ui/pagination'

const ACTION_LABELS: Record<string, string> = {
  user_activate: 'Usuario activado',
  user_deactivate: 'Usuario desactivado',
  promote_to_admin: 'Promoción admin',
  delete_message: 'Mensaje eliminado',
  flag_conversation: 'Conversación marcada',
  unflag_conversation: 'Marca removida',
}

function formatAction(action: string) {
  return ACTION_LABELS[action] ?? action.replaceAll('_', ' ')
}

function DetailsPreview({ details }: { details: Record<string, unknown> }) {
  const entries = Object.entries(details)
  if (entries.length === 0) return <span className="text-xs text-slate">Sin detalles</span>

  return (
    <div className="max-w-[260px] space-y-1 text-xs text-slate">
      {entries.slice(0, 2).map(([key, value]) => (
        <p key={key} className="truncate">
          <span className="font-semibold text-ink">{key}:</span> {String(value)}
        </p>
      ))}
      {entries.length > 2 && <p>+{entries.length - 2} datos más</p>}
    </div>
  )
}

const columns: Column<AdminAuditLogRow>[] = [
  {
    key: 'created_at',
    header: 'Fecha',
    render: (r) => (
      <div>
        <span className="block text-sm font-semibold text-ink">
          {new Date(r.created_at).toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
        <span className="text-xs text-slate">
          {new Date(r.created_at).toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    ),
  },
  {
    key: 'admin',
    header: 'Administrador',
    render: (r) => (
      <div>
        <span className="block text-sm font-semibold text-ink">{r.admin_name}</span>
        <span className="text-xs text-slate">{r.admin_email ?? 'Sin correo'}</span>
      </div>
    ),
  },
  {
    key: 'action',
    header: 'Acción',
    render: (r) => (
      <span className="inline-flex rounded-pill bg-canvas px-3 py-1 text-xs font-bold text-ink">
        {formatAction(r.action)}
      </span>
    ),
  },
  {
    key: 'target',
    header: 'Objetivo',
    render: (r) => (
      <div className="max-w-[220px]">
        <span className="block text-sm text-ink">{r.target_type ?? 'General'}</span>
        <span className="block truncate text-xs text-slate">{r.target_id ?? 'Sin ID'}</span>
      </div>
    ),
  },
  {
    key: 'details',
    header: 'Detalles',
    render: (r) => <DetailsPreview details={r.details} />,
  },
]

export default async function AuditoriasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number.parseInt(pageParam ?? '1', 10) || 1)
  const { rows, total, totalPages, pageSize } = await getAdminAuditLogs({ page })
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, total)

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <PageHeader
        eyebrow="Seguridad"
        title="Auditorías"
        description="Revisa las acciones administrativas registradas en TOKE+ para seguimiento y trazabilidad."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate/10 bg-white p-4 shadow-card">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-5 w-5 text-[#EE7070]" />
            <p className="text-xs font-bold uppercase tracking-eyebrow text-slate">Eventos</p>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-ink">{total}</p>
        </div>
        <div className="rounded-2xl border border-slate/10 bg-white p-4 shadow-card">
          <div className="flex items-center gap-3">
            <Fingerprint className="h-5 w-5 text-[#EE7070]" />
            <p className="text-xs font-bold uppercase tracking-eyebrow text-slate">Última página</p>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-ink">{page}</p>
        </div>
        <div className="rounded-2xl border border-slate/10 bg-white p-4 shadow-card">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-[#EE7070]" />
            <p className="text-xs font-bold uppercase tracking-eyebrow text-slate">Origen</p>
          </div>
          <p className="mt-2 text-sm font-extrabold text-ink">admin_audit_log</p>
        </div>
      </div>

      {total > 0 && (
        <p className="mb-3 text-xs font-medium text-slate">
          Mostrando {rangeStart}–{rangeEnd} de {total} evento{total === 1 ? '' : 's'}
        </p>
      )}

      <DataTable
        columns={columns}
        rows={rows}
        keyExtractor={(r) => String(r.id)}
        emptyMessage="Aún no hay eventos de auditoría registrados."
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/gestion-x7k2m9/auditorias"
      />
    </div>
  )
}
