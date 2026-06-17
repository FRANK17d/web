import { adminRoute, assertSameOrigin, jsonError, jsonOk } from '@/lib/admin-auth/http'
import { cerrarSesionAdmin, obtenerSesionAdmin } from '@/lib/admin-auth/service'
import {
  clearAdminSessionCookies,
  readAdminSessionCookies,
  setAdminSessionCookies,
} from '@/lib/admin-auth/cookies'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/admin/sessions/current — devuelve la sesión actual y, si el access
// token expiró pero el refresh sigue vivo, refresca y persiste cookies.
export const GET = adminRoute(async () => {
  const { accessToken, refreshToken } = await readAdminSessionCookies()

  if (!accessToken && !refreshToken) {
    return jsonError(401, 'SESION_REQUERIDA', 'No hay una sesión administrativa activa.')
  }

  try {
    const session = await obtenerSesionAdmin({ accessToken, refreshToken })

    if (session.refrescada) {
      await setAdminSessionCookies({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      })
    }

    return jsonOk({
      usuario: session.usuario,
      autenticado: true,
      refrescada: session.refrescada,
    })
  } catch {
    // Token inválido/expirado: limpiamos cookies para forzar re-login.
    await clearAdminSessionCookies()
    return jsonError(401, 'SESION_EXPIRADA', 'La sesión administrativa expiró.')
  }
})

// DELETE /api/admin/sessions/current — cerrar sesión.
export const DELETE = adminRoute(async (request) => {
  assertSameOrigin(request)
  const { accessToken, refreshToken } = await readAdminSessionCookies()

  await cerrarSesionAdmin({ accessToken, refreshToken })
  await clearAdminSessionCookies()

  return jsonOk({ cerrada: true })
})
