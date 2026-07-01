import Link from 'next/link'
import { getConversations, type ConversationRow } from '@/lib/admin-data/queries'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable, type Column } from '@/components/ui/data-table'

const columns: Column<ConversationRow>[] = [
  {
    key: 'participants',
    header: 'Participantes',
    render: (r) => (
      <div>
        <span className="font-medium">{r.participant_1_name}</span>
        <span className="mx-1.5 text-neutral-300">&harr;</span>
        <span className="font-medium">{r.participant_2_name}</span>
      </div>
    ),
  },
  {
    key: 'last_message',
    header: 'Ultimo mensaje',
    render: (r) =>
      r.last_message_preview ? (
        <span className="line-clamp-1 max-w-xs text-xs text-neutral-500">
          {r.last_message_preview}
        </span>
      ) : (
        <span className="text-xs text-neutral-300">Sin mensajes</span>
      ),
  },
  {
    key: 'message_count',
    header: 'Mensajes',
    render: (r) => (
      <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600">
        {r.message_count}
      </span>
    ),
  },
  {
    key: 'created_at',
    header: 'Creacion',
    render: (r) => (
      <span className="text-xs text-neutral-500">
        {new Date(r.created_at).toLocaleDateString('es-PE', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
      </span>
    ),
  },
  {
    key: 'actions',
    header: '',
    render: (r) => (
      <Link
        href={`/gestion-x7k2m9/mensajes/${r.id}`}
        className="rounded-lg bg-[#EE7070] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#d95f5f]"
      >
        Ver chat
      </Link>
    ),
  },
]

export default async function MensajesPage() {
  const conversations = await getConversations()

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <PageHeader
        eyebrow="Moderacion"
        title="Mensajes"
        description={`${conversations.length} conversaciones registradas.`}
      />
      <DataTable
        columns={columns}
        rows={conversations}
        keyExtractor={(r) => r.id}
        emptyMessage="No hay conversaciones registradas."
      />
    </div>
  )
}
