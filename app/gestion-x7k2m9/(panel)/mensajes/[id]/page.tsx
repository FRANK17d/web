import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getConversationMessages } from '@/lib/admin-data/queries'
import { PageHeader } from '@/components/ui/page-header'
import { DeleteMessageButton, FlagConversationButton } from './moderation-actions'

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const messages = await getConversationMessages(id)

  if (!messages.length) {
    notFound()
  }

  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/gestion-x7k2m9/mensajes"
          className="text-xs font-semibold text-neutral-400 hover:text-neutral-600"
        >
          &larr; Volver a conversaciones
        </Link>
        <FlagConversationButton conversationId={id} />
      </div>

      <PageHeader
        eyebrow="Moderacion"
        title="Detalle de conversacion"
        description={`${messages.length} mensajes en esta conversacion.`}
      />

      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="group relative rounded-hero border border-slate/10 bg-white px-5 py-4 shadow-card"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-neutral-800">
                {msg.sender_name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">
                  {new Date(msg.created_at).toLocaleString('es-PE', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <DeleteMessageButton messageId={msg.id} />
              </div>
            </div>
            <p className="text-sm leading-relaxed text-neutral-600 whitespace-pre-wrap">
              {msg.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
