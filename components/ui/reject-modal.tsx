'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

/**
 * Modal genérico para capturar un motivo de rechazo (pedidos, verificaciones…).
 * El padre controla la visibilidad renderizándolo condicionalmente.
 */
export function RejectModal({
  title,
  description,
  label = 'Motivo del rechazo',
  placeholder,
  confirmLabel = 'Confirmar rechazo',
  reason,
  onReasonChange,
  onCancel,
  onConfirm,
  isPending,
  error,
}: {
  title: string
  description: string
  label?: string
  placeholder: string
  confirmLabel?: string
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
      aria-label={title}
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCancel}
        className="absolute inset-0 cursor-default bg-ink/40 backdrop-blur-[2px] motion-safe:animate-fade-in"
      />

      <div className="relative w-full max-w-md rounded-3xl border border-slate/10 bg-white p-6 shadow-card motion-safe:animate-scale-in">
        <div className="mb-1 flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          <button
            onClick={onCancel}
            disabled={isPending}
            aria-label="Cerrar"
            className="rounded-lg p-1 text-slate transition-colors hover:bg-canvas hover:text-ink disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mb-4 text-sm text-slate">{description}</p>

        <label className="mb-1.5 block text-xs font-bold uppercase tracking-eyebrow text-slate">
          {label}
        </label>
        <textarea
          ref={textareaRef}
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          rows={4}
          maxLength={500}
          disabled={isPending}
          placeholder={placeholder}
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
            {isPending ? 'Procesando…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
