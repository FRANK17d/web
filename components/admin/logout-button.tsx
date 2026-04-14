'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { callAdminApi } from '@/lib/admin-auth/browser'
import { FullPageLoader } from '@/components/full-page-loader'

export function AdminLogoutButton() {
  const router = useRouter()
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

      router.push('/administracion/iniciar-sesion')
      router.refresh()
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
        className="rounded-lg p-2 text-surface-400 transition-colors hover:bg-danger-50 hover:text-danger-500 disabled:cursor-not-allowed disabled:opacity-70"
        title="Cerrar sesión"
      >
        <LogOut className="h-4 w-4" />
      </button>

      {error ? (
        <div className="absolute bottom-full right-0 mb-2 w-64 rounded-xl border border-danger-500/20 bg-danger-50 px-3 py-2 text-xs text-danger-700 shadow-lg">
          {error}
        </div>
      ) : null}
    </div>
    </>
  )
}
