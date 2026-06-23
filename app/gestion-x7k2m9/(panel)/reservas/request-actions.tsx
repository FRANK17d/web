'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, X } from 'lucide-react'
import { approveRequest, rejectRequest } from '@/lib/admin-data/actions'

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
          title={title}
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

function RejectModal({
  title,
  reason,
  onReasonChange,
  onCancel,
  onConfirm,
  isPending,
  error,
}: {
  title: string
  reason: string
  onReasonChange: (value: string) => void
  onCancel: () => void
  onConfirm: () => void
  isPending: boolean
  error: string | null
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onCancel])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Rechazar pedido ${title}`}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCancel}
        className="absolute inset-0 cursor-default bg-ink/40 backdrop-blur-[2px] motion-safe:animate-fade-in"
      />

      {/* Card */}
      <div className="relative w-full max-w-md rounded-3xl border border-slate/10 bg-white p-6 shadow-card motion-safe:animate-scale-in">
        <div className="mb-1 flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold text-ink">Rechazar pedido</h2>
          <button
            onClick={onCancel}
            disabled={isPending}
            aria-label="Cerrar"
            className="rounded-lg p-1 text-slate transition-colors hover:bg-canvas hover:text-ink disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mb-4 text-sm text-slate">
          El motivo se le mostrará al cliente. Sé claro y respetuoso.
        </p>

        <label className="mb-1.5 block text-xs font-bold uppercase tracking-eyebrow text-slate">
          Motivo del rechazo
        </label>
        <textarea
          ref={textareaRef}
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          rows={4}
          maxLength={500}
          disabled={isPending}
          placeholder="Ej: Las fotos no corresponden al servicio solicitado…"
          className="w-full resize-none rounded-xl border border-slate/15 bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-slate/60 focus:border-red-300 focus:ring-2 focus:ring-red-200 disabled:opacity-60"
        />

        {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate transition-colors hover:bg-canvas disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending || !reason.trim()}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? 'Rechazando…' : 'Confirmar rechazo'}
          </button>
        </div>
      </div>
    </div>
  )
}
