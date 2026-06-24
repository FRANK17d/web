'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { adjustCredits } from '@/lib/admin-data/actions'

export function CreditAdjustForm({ technicianId }: { technicianId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFeedback(null)

    const formData = new FormData()
    formData.set('technicianId', technicianId)
    formData.set('amount', amount)
    formData.set('reason', reason)

    startTransition(async () => {
      const result = await adjustCredits(formData)
      if (result.success) {
        setFeedback({ type: 'success', message: result.message ?? 'Créditos ajustados.' })
        setAmount('')
        setReason('')
        setTimeout(() => {
          setShowForm(false)
          setFeedback(null)
        }, 2000)
        router.refresh()
      } else {
        setFeedback({ type: 'error', message: result.message ?? 'Error al ajustar créditos.' })
      }
    })
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate/15 px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-white hover:shadow-sm"
      >
        Ajustar créditos
      </button>
    )
  }

  return (
    <div className="mt-4 rounded-2xl border border-slate/10 bg-canvas p-4">
      <h3 className="mb-3 text-sm font-bold text-ink">Ajuste manual de créditos</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="credit-amount" className="block text-xs font-medium text-slate">
            Monto (positivo = agregar, negativo = deducir)
          </label>
          <input
            id="credit-amount"
            type="number"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ej: 10 o -5"
            required
            className="mt-1 w-full rounded-lg border border-slate/15 px-3 py-2 text-sm text-ink placeholder:text-slate/50 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
          />
        </div>
        <div>
          <label htmlFor="credit-reason" className="block text-xs font-medium text-slate">
            Motivo del ajuste
          </label>
          <textarea
            id="credit-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ej: Compensación por error en cobro"
            required
            rows={2}
            className="mt-1 w-full resize-none rounded-lg border border-slate/15 px-3 py-2 text-sm text-ink placeholder:text-slate/50 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
          />
        </div>

        {feedback && (
          <p className={`rounded-lg px-3 py-2 text-xs font-medium ${
            feedback.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}>
            {feedback.message}
          </p>
        )}

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-ink/90 disabled:opacity-50"
          >
            {isPending ? 'Guardando...' : 'Aplicar ajuste'}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowForm(false)
              setFeedback(null)
              setAmount('')
              setReason('')
            }}
            disabled={isPending}
            className="rounded-lg border border-slate/15 px-4 py-2 text-xs font-semibold text-slate transition-colors hover:bg-white disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
