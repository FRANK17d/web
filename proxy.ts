import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  ADMIN_BASE_PATH,
  ADMIN_COOKIE_NAMES,
  ADMIN_LOGIN_PATH,
  ADMIN_RECOVERY_PATH,
} from '@/lib/admin-auth/config'

/**
 * Chequeo optimista de auth en el edge.
 *
 * NO valida tokens (sin llamadas a red/DB). Solo verifica si existe al menos
 * una cookie de sesión. Si no hay ninguna, el usuario está garantizado sin
 * autenticar y redirigimos de inmediato — evitando el render RSC completo.
 *
 * La validación real ocurre del lado del servidor en el layout vía
 * getAdminSession() (que confirma rol admin activo contra InsForge).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isLoginRoute =
    pathname === ADMIN_LOGIN_PATH || pathname === `${ADMIN_LOGIN_PATH}/`
  const isRecoveryRoute = pathname.startsWith(ADMIN_RECOVERY_PATH)

  const hasSession =
    request.cookies.has(ADMIN_COOKIE_NAMES.access) ||
    request.cookies.has(ADMIN_COOKIE_NAMES.refresh)

  // ── Rutas del panel (excepto login y recuperación) ──
  const isAdminPanel =
    pathname.startsWith(ADMIN_BASE_PATH) && !isLoginRoute && !isRecoveryRoute

  if (isAdminPanel && !hasSession) {
    const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url)
    loginUrl.searchParams.set('redireccion', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ── Usuario ya logueado entrando al login → al panel ──
  if (isLoginRoute && hasSession) {
    return NextResponse.redirect(new URL(ADMIN_BASE_PATH, request.url))
  }

  return NextResponse.next()
}

export const config = {
  // El matcher debe ser estático. Si cambias ADMIN_BASE_PATH, actualiza esto.
  matcher: ['/gestion-x7k2m9/:path*'],
}
