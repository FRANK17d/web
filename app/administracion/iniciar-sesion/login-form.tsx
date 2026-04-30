'use client'

import type { FormEvent } from 'react'
import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { callAdminApi } from '@/lib/admin-auth/browser'
import { sanitizeAdminRedirect } from '@/lib/admin-auth/config'
import { toast } from 'sonner'

export function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = sanitizeAdminRedirect(searchParams.get('redireccion'))

  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    // The server component already checks the session and redirects
    // authenticated users. This client-side check only handles the bfcache
    // edge case: the user logged in on another tab and navigated back via
    // browser history, restoring a stale page from cache.
    function handlePageShow(event: PageTransitionEvent) {
      if (!event.persisted) return

      void callAdminApi('/api/admin/sessions/current').then((result) => {
        if (result.ok) {
          window.location.href = '/administracion'
        }
      })
    }

    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

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
      // Hard navigation so the browser sends the freshly-set auth cookies
      // in the HTTP request. router.replace() would do a soft navigation
      // where the Next.js server component reads cookies from the original
      // request (which doesn't have them yet), causing a false auth failure.
      window.location.href = redirectTo
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold text-neutral-700">
          Correo electrónico
        </label>
        <input
          id="login-email"
          name="correo"
          type="email"
          required
          autoComplete="email"
          spellCheck={false}
          placeholder="tu@correo.com"
          disabled={isPending}
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 transition-all focus:border-[#EE7070] focus:outline-none focus:ring-2 focus:ring-[#EE7070]/20 disabled:bg-neutral-50 disabled:text-neutral-400"
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
            placeholder="••••••••"
            disabled={isPending}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 pr-12 text-sm text-neutral-800 placeholder:text-neutral-400 transition-all focus:border-[#EE7070] focus:outline-none focus:ring-2 focus:ring-[#EE7070]/20 disabled:bg-neutral-50 disabled:text-neutral-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#EE7070]/20 transition-colors"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
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
          className="w-full rounded-xl bg-[#EE7070] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#D94F4F] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#EE7070]/25 active:scale-[0.98]"
        >
          {isPending ? (
            <>
              <svg className="mr-2 inline h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
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
          href="/administracion/olvide-mi-contrasena"
          className="text-sm font-medium text-[#EE7070] transition-colors hover:text-[#D94F4F] hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </form>
  )
}
