'use client'

import type { FormEvent } from 'react'
import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { callAdminApi } from '@/lib/admin-auth/browser'
import { sanitizeAdminRedirect } from '@/lib/admin-auth/config'
import { toast } from 'sonner'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = sanitizeAdminRedirect(searchParams.get('redireccion'))

  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function syncSessionState() {
      const result = await callAdminApi('/api/admin/sessions/current')

      if (!isMounted) {
        return
      }

      if (result.ok) {
        router.replace('/administracion')
        return
      }

      setIsCheckingSession(false)
    }

    function handlePageShow() {
      void syncSessionState()
    }

    void syncSessionState()
    window.addEventListener('pageshow', handlePageShow)

    return () => {
      isMounted = false
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [router])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const correo = String(formData.get('correo') ?? '').trim()
    const contrasena = String(formData.get('contrasena') ?? '')

    startTransition(async () => {
      const result = await callAdminApi('/api/admin/sessions', {
        method: 'POST',
        body: JSON.stringify({ correo, contrasena }),
      })

      if (!result.ok) {
        toast.error(result.error || 'Autenticación fallida. Revisa tus credenciales.')
        return
      }

      toast.success('Sesión iniciada correctamente')
      router.replace(redirectTo)
    })
  }

  if (isCheckingSession) {
    return (
      <div role="status" aria-live="polite" className="relative h-[240px] w-full animate-pulse rounded-xl bg-surface-50 sm:h-[280px]">
        <span className="sr-only">Verificando sesión…</span>
      </div>
    )
  }

  return (
    <>
      <div>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-surface-700 sm:mb-2">
            Correo electrónico
          </label>
          <input
            id="login-email"
            name="correo"
            type="email"
            required
            autoComplete="email"
            spellCheck={false}
            placeholder="Ingresa aquí tu correo electrónico"
            disabled={isPending}
            className="w-full rounded-xl border border-surface-300 px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-surface-50 disabled:text-surface-500 sm:py-2.5 sm:text-base"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-surface-700 sm:mb-2">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="login-password"
              name="contrasena"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="Ingresa aquí tu contraseña"
              disabled={isPending}
              className="w-full rounded-xl border border-surface-300 px-3 py-2 pr-10 text-sm text-surface-900 placeholder:text-surface-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-surface-50 disabled:text-surface-500 sm:py-2.5 sm:text-base"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-surface-400 hover:bg-surface-100 hover:text-surface-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        <div className="pt-1 sm:pt-2">
          <button 
            type="submit" 
            disabled={isPending} 
            className="flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:bg-brand-400 sm:py-3"
          >
            {isPending ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Ingresando...
              </>
            ) : (
              'Ingresar'
            )}
          </button>
        </div>

        <div className="mt-4 text-center sm:mt-6">
          <Link 
            href="/administracion/olvide-mi-contrasena"
            className="text-xs font-medium text-brand-600 transition-colors hover:text-brand-800 hover:underline sm:text-sm"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </form>
    </div>
    </>
  )
}
