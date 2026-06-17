import 'server-only'

import { cache } from 'react'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAMES } from '@/lib/admin-auth/config'
import { obtenerSesionAdmin } from '@/lib/admin-auth/service'
import type { AdminSessionUser } from '@/lib/admin-auth/repository'

export type { AdminSessionUser }

// React.cache() deduplica la llamada dentro del mismo render RSC, así que
// layout.tsx y page.tsx pueden llamar getAdminSession() sin disparar dos
// validaciones contra InsForge.
//
// Solo valida y devuelve el usuario admin (o null). NO persiste tokens
// refrescados: un Server Component no puede escribir cookies. El refresh con
// persistencia ocurre en el route handler GET /api/admin/sessions/current y
// al iniciar sesión.
export const getAdminSession = cache(async (): Promise<AdminSessionUser | null> => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ADMIN_COOKIE_NAMES.access)?.value ?? null
  const refreshToken = cookieStore.get(ADMIN_COOKIE_NAMES.refresh)?.value ?? null

  if (!accessToken && !refreshToken) {
    return null
  }

  try {
    const session = await obtenerSesionAdmin({ accessToken, refreshToken })
    return session.usuario
  } catch {
    return null
  }
})
