'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { verifyTechnician, rejectTechnician } from '@/lib/admin-data/actions'

export function VerificationActions({
  techProfileId,
  name,
}: {
  techProfileId: string
  name: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showReject, setShowReject] = useState(false)
  const [reason, setReason] = useState('')

  function handleVerify() {
    startTransition(async () => {
      await verifyTechnician(techProfileId)
      router.refresh()
    })
  }

  function handleReject() {
    if (!reason.trim()) return
    startTransition(async () => {
      await rejectTechnician(techProfileId, reason.trim())
      setShowReject(false)
      router.refresh()
    })
  }

  if (showReject) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Motivo..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs w-36 focus:outline-none focus:ring-1 focus:ring-red-300"
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
        onClick={handleVerify}
        disabled={isPending}
        aria-label={`Verificar a ${name}`}
        className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600 disabled:opacity-50"
      >
        Verificar
      </button>
      <button
        onClick={() => setShowReject(true)}
        disabled={isPending}
        aria-label={`Rechazar verificación de ${name}`}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
      >
        Rechazar
      </button>
    </div>
  )
}
