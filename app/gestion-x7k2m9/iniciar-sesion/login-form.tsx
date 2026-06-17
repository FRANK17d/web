'use client'

import type { FormEvent } from 'react'
import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { callAdminApi } from '@/lib/admin-auth/browser'
import {
  ADMIN_BASE_PATH,
  ADMIN_RECOVERY_PATH,
  sanitizeAdminRedirect,
} from '@/lib/admin-auth/config'
import { toast } from 'sonner'

export function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = sanitizeAdminRedirect(searchParams.get('redireccion'))

  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    // El server component ya valida la sesión y redirige a los autenticados.
    // Este chequeo solo cubre el caso bfcache: el usuario inició sesión en
    // otra pestaña y volvió con el historial, restaurando una página cacheada.
    function handlePageShow(event: PageTransitionEvent) {
      if (!event.persisted) return

      void callAdminApi('/api/admin/sessions/current').then((result) => {
        if (result.ok) {
          window.location.href = ADMIN_BASE_PATH
        }
      })
    }

    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMsg(null)

    const formData = new FormData(event.currentTarget)
    const correo = String(formData.get('correo') ?? '').trim()
    const contrasena = String(formData.get('contrasena') ?? '')

    startTransition(async () => {
      const result = await callAdminApi('/api/admin/sessions', {
        method: 'POST',
        body: JSON.stringify({ correo, contrasena }),
      })

      if (!result.ok) {
        const message = result.error || 'Autenticación fallida. Revisa tus credenciales.'
        setErrorMsg(message)
        toast.error(message)
        return
      }

      toast.success('Sesión iniciada correctamente')
      // Navegación dura para que el navegador mande las cookies recién fijadas
      // en la petición. Una navegación suave leería las cookies de la request
      // original (sin ellas) y provocaría un falso fallo de auth.
      window.location.href = redirectTo
    })
  }

  const describedBy = errorMsg ? 'login-error' : undefined

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {errorMsg ? (
        <div
          id="login-error"
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-[#EE7070]/30 bg-[#EE7070]/5 px-3.5 py-3 text-sm text-[#B23B3B]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      ) : null}

      <div>
        <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold text-neutral-700">
          Correo electrónico
        </label>
        <input
          id="login-email"
          name="correo"
          type="email"
          required
          autoFocus
          autoComplete="email"
          spellCheck={false}
          aria-invalid={errorMsg ? true : undefined}
          aria-describedby={describedBy}
          placeholder="tu@correo.com"
          disabled={isPending}
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 transition-all focus-visible:border-[#EE7070] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE7070]/30 disabled:bg-neutral-50 disabled:text-neutral-400 motion-reduce:transition-none"
        />
      </div>

      <div>
        <label htmlFor="login-password" className="mb-1.5 block text-sm font-semibold text-neutral-700">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="login-password"
            name="contrasena"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            aria-invalid={errorMsg ? true : undefined}
            aria-describedby={describedBy}
            placeholder="••••••••"
            disabled={isPending}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 pr-12 text-sm text-neutral-800 placeholder:text-neutral-400 transition-all focus-visible:border-[#EE7070] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE7070]/30 disabled:bg-neutral-50 disabled:text-neutral-400 motion-reduce:transition-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE7070]/30 motion-reduce:transition-none"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={showPassword}
            title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className="pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[#EE7070] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#EE7070]/25 transition-all duration-200 hover:bg-[#D94F4F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE7070]/40 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          {isPending ? (
            <>
              <svg className="mr-2 inline h-4 w-4 animate-spin motion-reduce:animate-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
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

      <div className="mt-4 text-center">
        <Link
          href={ADMIN_RECOVERY_PATH}
          className="rounded text-sm font-medium text-[#EE7070] transition-colors hover:text-[#D94F4F] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE7070]/30"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </form>
  )
}
