'use client'

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteMessage, flagConversation } from '@/lib/admin-data/actions'

export function DeleteMessageButton({
  messageId,
}: {
  messageId: string
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <button
      disabled={isPending}
      className="rounded-md bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600 opacity-0 transition group-hover:opacity-100 hover:bg-red-100 disabled:opacity-50"
      onClick={() => {
        if (!confirm('¿Eliminar este mensaje? Esta acción no se puede deshacer.')) return
        startTransition(async () => {
          const result = await deleteMessage(messageId)
          if (result.success) {
            router.refresh()
          } else {
            alert(result.message ?? 'Error al eliminar')
          }
        })
      }}
    >
      {isPending ? '...' : 'Eliminar'}
    </button>
  )
}

export function FlagConversationButton({
  conversationId,
}: {
  conversationId: string
}) {
  const [isPending, startTransition] = useTransition()
  const [showInput, setShowInput] = useState(false)
  const [reason, setReason] = useState('')

  if (showInput) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Motivo del flag..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs focus:border-red-300 focus:outline-none focus:ring-1 focus:ring-red-200"
        />
        <button
          disabled={isPending}
          className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
          onClick={() => {
            startTransition(async () => {
              const result = await flagConversation(conversationId, reason)
              if (result.success) {
                setShowInput(false)
                setReason('')
              } else {
                alert(result.message ?? 'Error')
              }
            })
          }}
        >
          {isPending ? '...' : 'Confirmar'}
        </button>
        <button
          className="text-xs text-neutral-400 hover:text-neutral-600"
          onClick={() => setShowInput(false)}
        >
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <button
      className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700 hover:bg-orange-100"
      onClick={() => setShowInput(true)}
    >
      Reportar conversacion
    </button>
  )
}
