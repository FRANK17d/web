'use client'

import { AlertTriangle } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-50">
          <AlertTriangle className="h-8 w-8 text-danger-500" />
        </div>
        <h2 className="text-xl font-bold text-surface-900">Algo salió mal</h2>
        <p className="mt-2 text-sm text-surface-500">
          {error.message || 'Ocurrió un error inesperado. Por favor, intenta de nuevo.'}
        </p>
        <button onClick={reset} className="btn-primary mt-6">
          Intentar de nuevo
        </button>
      </div>
    </div>
  )
}
