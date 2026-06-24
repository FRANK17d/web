'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { approveRequest, rejectRequest } from '@/lib/admin-data/actions'
import { RejectModal } from '@/components/ui/reject-modal'

export function RequestActions({ requestId, title }: { requestId: string; title: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showReject, setShowReject] = useState(false)
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleApprove() {
    setError(null)
    startTransition(async () => {
      const result = await approveRequest(requestId)
      if (result && 'success' in result && result.success === false) {
        setError(result.message ?? 'No se pudo aprobar el pedido.')
        return
      }
      router.refresh()
    })
  }

  function handleReject() {
    const trimmed = reason.trim()
    if (!trimmed) return
    setError(null)
    startTransition(async () => {
      const result = await rejectRequest(requestId, trimmed)
      if (result && 'success' in result && result.success === false) {
        setError(result.message ?? 'No se pudo rechazar el pedido.')
        return
      }
      setShowReject(false)
      setReason('')
      router.refresh()
    })
  }

  function closeModal() {
    if (isPending) return
    setShowReject(false)
    setError(null)
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={handleApprove}
          disabled={isPending}
          aria-label={`Aprobar pedido ${title}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Aprobar
        </button>
        <button
          onClick={() => {
            setError(null)
            setShowReject(true)
          }}
          disabled={isPending}
          aria-label={`Rechazar pedido ${title}`}
          className="rounded-lg border border-red-200 px-3.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
        >
          Rechazar
        </button>
      </div>

      {showReject && (
        <RejectModal
          title="Rechazar pedido"
          description="El motivo se le mostrará al cliente. Sé claro y respetuoso."
          placeholder="Ej: Las fotos no corresponden al servicio solicitado…"
          reason={reason}
          onReasonChange={setReason}
          onCancel={closeModal}
          onConfirm={handleReject}
          isPending={isPending}
          error={error}
        />
      )}
    </>
  )
}
