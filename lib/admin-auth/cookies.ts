import 'server-only'

import { cookies } from 'next/headers'
import { ADMIN_COOKIE_MAX_AGE, ADMIN_COOKIE_NAMES } from '@/lib/admin-auth/config'

const isProd = process.env.NODE_ENV === 'production'

const baseCookie = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax' as const,
  path: '/',
}

export async function setAdminSessionCookies(tokens: {
  accessToken: string
  refreshToken: string | null
}) {
  const store = await cookies()

  store.set(ADMIN_COOKIE_NAMES.access, tokens.accessToken, {
    ...baseCookie,
    maxAge: ADMIN_COOKIE_MAX_AGE.access,
  })

  if (tokens.refreshToken) {
    store.set(ADMIN_COOKIE_NAMES.refresh, tokens.refreshToken, {
      ...baseCookie,
      maxAge: ADMIN_COOKIE_MAX_AGE.refresh,
    })
  }
}

export async function clearAdminSessionCookies() {
  const store = await cookies()
  store.set(ADMIN_COOKIE_NAMES.access, '', { ...baseCookie, maxAge: 0 })
  store.set(ADMIN_COOKIE_NAMES.refresh, '', { ...baseCookie, maxAge: 0 })
}

export async function readAdminSessionCookies() {
  const store = await cookies()
  return {
    accessToken: store.get(ADMIN_COOKIE_NAMES.access)?.value ?? null,
    refreshToken: store.get(ADMIN_COOKIE_NAMES.refresh)?.value ?? null,
  }
}
