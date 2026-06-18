'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateSupportTicketStatus } from '@/lib/admin-data/actions'

type TicketStatus = 'open' | 'in_progress' | 'closed'

export function TicketStatusActions({
  ticketId,
  status,
  subject,
}: {
  ticketId: string
  status: string
  subject: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function update(statusValue: TicketStatus) {
    startTransition(async () => {
      await updateSupportTicketStatus(ticketId, statusValue)
      router.refresh()
    })
  }

  if (status === 'closed') {
    return (
      <button
        aria-label={`Reabrir ticket ${subject}`}
        className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600 disabled:opacity-50"
        disabled={isPending}
        onClick={() => update('open')}
      >
        {isPending ? '...' : 'Reabrir'}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {status !== 'in_progress' && (
        <button
          aria-label={`Marcar ticket ${subject} en seguimiento`}
          className="rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50 disabled:opacity-50"
          disabled={isPending}
          onClick={() => update('in_progress')}
        >
          En seguimiento
        </button>
      )}
      <button
        aria-label={`Cerrar ticket ${subject}`}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
        disabled={isPending}
        onClick={() => update('closed')}
      >
        {isPending ? '...' : 'Cerrar'}
      </button>
    </div>
  )
}
