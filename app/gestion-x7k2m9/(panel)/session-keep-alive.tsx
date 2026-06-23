'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Mantiene viva la sesión admin.
 *
 * Bug que resuelve: el access token de InsForge vive ~1h. Como un Server
 * Component no puede escribir cookies, al expirar el token TODAS las queries del
 * panel fallaban en silencio (devolvían vacío) y la única forma de recuperarse
 * era cerrar sesión y volver a entrar. Aquí llamamos periódicamente (y al volver
 * a la pestaña) a `GET /api/admin/sessions/current`, que refresca y PERSISTE el
 * token en las cookies cuando hace falta. Si se refrescó, forzamos un
 * `router.refresh()` para re-renderizar con datos frescos. Si la sesión murió
 * del todo (401), mandamos al login.
 */
export function SessionKeepAlive({ intervalMs = 4 * 60 * 1000 }: { intervalMs?: number }) {
  const router = useRouter()
  const inFlight = useRef(false)

  useEffect(() => {
    let cancelled = false

    async function ensureSession(refreshOnSuccess: boolean) {
      if (inFlight.current) return
      inFlight.current = true
      try {
        const res = await fetch('/api/admin/sessions/current', {
          method: 'GET',
          credentials: 'same-origin',
          cache: 'no-store',
        })
        if (cancelled) return

        if (res.status === 401) {
          window.location.href = '/gestion-x7k2m9/iniciar-sesion'
          return
        }
        if (!res.ok) return

        const body = (await res.json().catch(() => null)) as
          | { ok?: boolean; datos?: { refrescada?: boolean } }
          | null
        const refrescada = body?.datos?.refrescada === true

        if (!cancelled && (refrescada || refreshOnSuccess)) {
          router.refresh()
        }
      } catch {
        // Sin red: reintenta en el próximo tick.
      } finally {
        inFlight.current = false
      }
    }

    // Chequeo al montar (sin forzar refresh salvo que se haya refrescado).
    ensureSession(false)

    const id = setInterval(() => ensureSession(false), intervalMs)

    function onVisible() {
      if (document.visibilityState === 'visible') ensureSession(true)
    }

    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onVisible)

    return () => {
      cancelled = true
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onVisible)
    }
  }, [router, intervalMs])

  return null
}
