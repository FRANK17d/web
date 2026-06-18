'use client'

import { type FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { replySupportTicket } from '@/lib/admin-data/actions'

type ActionResult = {
  success?: boolean
  message?: string
}

export function TicketReplyForm({ ticketId, disabled }: { ticketId: string; disabled: boolean }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!message.trim() || disabled) return

    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      const result = (await replySupportTicket(formData)) as ActionResult
      if (result.success) {
        setMessage('')
        setError(null)
        router.refresh()
        return
      }
      setError(result.message ?? 'No se pudo enviar la respuesta.')
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="ticketId" type="hidden" value={ticketId} />
      <label className="block space-y-2">
        <span className="text-sm font-bold text-ink">Respuesta de soporte</span>
        <textarea
          className="min-h-28 w-full resize-y rounded-2xl border border-slate/15 px-4 py-3 text-sm outline-none focus:border-[#EE7070] disabled:bg-canvas disabled:text-slate"
          disabled={disabled || isPending}
          name="body"
          onChange={(event) => setMessage(event.target.value)}
          placeholder={disabled ? 'Reabre el ticket para responder.' : 'Escribe una respuesta para el usuario...'}
          value={message}
        />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-xl bg-[#EE7070] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#d95f5f] disabled:opacity-50"
          disabled={disabled || isPending || !message.trim()}
          type="submit"
        >
          {isPending ? 'Enviando...' : 'Responder'}
        </button>
        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      </div>
    </form>
  )
}
