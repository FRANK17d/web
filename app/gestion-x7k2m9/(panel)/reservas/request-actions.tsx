'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { approveRequest, rejectRequest } from '@/lib/admin-data/actions'

export function RequestActions({ requestId, title }: { requestId: string; title: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showReject, setShowReject] = useState(false)
  const [reason, setReason] = useState('')

  function handleApprove() {
    startTransition(async () => {
      await approveRequest(requestId)
      router.refresh()
    })
  }

  function handleReject() {
    if (!reason.trim()) return
    startTransition(async () => {
      await rejectRequest(requestId, reason.trim())
      setShowReject(false)
      router.refresh()
    })
  }

  if (showReject) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Motivo de rechazo..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs w-40 focus:outline-none focus:ring-1 focus:ring-red-300"
          disabled={isPending}
        />
        <button
          onClick={handleReject}
          disabled={isPending || !reason.trim()}
          className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50"
        >
          Confirmar
        </button>
        <button
          onClick={() => setShowReject(false)}
          disabled={isPending}
          className="text-xs text-neutral-400 hover:text-neutral-600"
        >
          ✕
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleApprove}
        disabled={isPending}
        aria-label={`Aprobar pedido ${title}`}
        className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600 disabled:opacity-50"
      >
        Aprobar
      </button>
      <button
        onClick={() => setShowReject(true)}
        disabled={isPending}
        aria-label={`Rechazar pedido ${title}`}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
      >
        Rechazar
      </button>
    </div>
  )
}
