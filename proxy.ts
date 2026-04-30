import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_ACCESS_COOKIE = 'maestroya_admin_access_token'
const ADMIN_REFRESH_COOKIE = 'maestroya_admin_refresh_token'
const LOGIN_PATH = '/administracion/iniciar-sesion'

/**
 * Optimistic auth check at the edge.
 *
 * This does NOT validate tokens (no DB/network call). It only checks
 * whether at least one auth cookie exists. If neither cookie is
 * present the user is guaranteed unauthenticated and we redirect
 * immediately — avoiding the full RSC render.
 *
 * Real validation still happens server-side in the layout via
 * getAdminSession().
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Admin panel routes (excluding login & password-reset pages) ──
  const isAdminPanel =
    pathname.startsWith('/administracion') &&
    pathname !== LOGIN_PATH &&
    !pathname.startsWith('/administracion/iniciar-sesion') &&
    !pathname.startsWith('/administracion/olvide-mi-contrasena')

  if (isAdminPanel) {
    const hasAccess = request.cookies.has(ADMIN_ACCESS_COOKIE)
    const hasRefresh = request.cookies.has(ADMIN_REFRESH_COOKIE)

    if (!hasAccess && !hasRefresh) {
      const loginUrl = new URL(LOGIN_PATH, request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // ── Logged-in users hitting the login page → redirect to dashboard ──
  if (pathname === LOGIN_PATH || pathname === '/administracion/iniciar-sesion/') {
    const hasAccess = request.cookies.has(ADMIN_ACCESS_COOKIE)
    const hasRefresh = request.cookies.has(ADMIN_REFRESH_COOKIE)

    if (hasAccess || hasRefresh) {
      return NextResponse.redirect(new URL('/administracion', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/administracion/:path*'],
}
