'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Refresca la ruta periódicamente para que aparezcan datos nuevos sin recargar
 * a mano — pero SOLO cuando la pestaña está visible. En segundo plano no
 * consume requests; al volver a la pestaña refresca al instante. Compartido por
 * los listados del panel (pedidos, verificaciones…).
 */
export function AutoRefresh({ intervalMs = 20000 }: { intervalMs?: number }) {
  const router = useRouter()

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined

    const start = () => {
      if (id) return
      id = setInterval(() => {
        if (document.visibilityState === 'visible') router.refresh()
      }, intervalMs)
    }
    const stop = () => {
      if (id) {
        clearInterval(id)
        id = undefined
      }
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        router.refresh() // refresco inmediato al volver
        start()
      } else {
        stop() // pausa en segundo plano
      }
    }

    if (document.visibilityState === 'visible') start()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [router, intervalMs])

  return null
}
