'use client'

import { useState, useTransition } from 'react'
import { LogOut } from 'lucide-react'
import { callAdminApi } from '@/lib/admin-auth/browser'
import { ADMIN_LOGIN_PATH } from '@/lib/admin-auth/config'
import { FullPageLoader } from '@/components/full-page-loader'

export function AdminLogoutButton() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleLogout() {
    setError(null)

    startTransition(async () => {
      const result = await callAdminApi('/api/admin/sessions/current', {
        method: 'DELETE',
      })

      if (!result.ok) {
        setError(result.error || 'No se pudo cerrar la sesión.')
        return
      }

      // Navegación dura para limpiar estado RSC cacheado y cookies viejas.
      window.location.href = ADMIN_LOGIN_PATH
    })
  }

  return (
    <>
      {isPending && <FullPageLoader label="Cerrando sesión..." />}

      <div className="relative">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isPending}
          className="rounded-lg p-2 text-surface-400 transition-colors hover:bg-danger-50 hover:text-danger-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500/40 disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
        </button>

        {error ? (
          <div
            role="alert"
            className="absolute bottom-full right-0 mb-2 w-64 rounded-xl border border-danger-500/20 bg-danger-50 px-3 py-2 text-xs text-danger-700 shadow-lg"
          >
            {error}
          </div>
        ) : null}
      </div>
    </>
  )
}
