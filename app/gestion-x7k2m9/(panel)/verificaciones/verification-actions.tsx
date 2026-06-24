'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { verifyTechnician, rejectTechnician } from '@/lib/admin-data/actions'
import { RejectModal } from '@/components/ui/reject-modal'

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
  const [error, setError] = useState<string | null>(null)

  function handleVerify() {
    setError(null)
    startTransition(async () => {
      const result = await verifyTechnician(techProfileId)
      if (result && 'success' in result && result.success === false) {
        setError(result.message ?? 'No se pudo verificar al técnico.')
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
      const result = await rejectTechnician(techProfileId, trimmed)
      if (result && 'success' in result && result.success === false) {
        setError(result.message ?? 'No se pudo rechazar la verificación.')
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
          onClick={handleVerify}
          disabled={isPending}
          aria-label={`Verificar a ${name}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Verificar
        </button>
        <button
          onClick={() => {
            setError(null)
            setShowReject(true)
          }}
          disabled={isPending}
          aria-label={`Rechazar verificación de ${name}`}
          className="rounded-lg border border-red-200 px-3.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
        >
          Rechazar
        </button>
      </div>

      {showReject && (
        <RejectModal
          title="Rechazar verificación"
          description={`El motivo se le mostrará a ${name} para que pueda corregir y reenviar.`}
          placeholder="Ej: La foto del DNI está borrosa, vuelve a subirla con buena luz…"
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
