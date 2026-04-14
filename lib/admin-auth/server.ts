import 'server-only'

import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAMES, getServerBackendUrl } from '@/lib/admin-auth/config'

export type AdminSessionUser = {
  id: string
  authUserId: string
  email: string
  nombres: string
  apellidos: string
  nombreCompleto: string
  rol: 'admin'
  activo: boolean
  ultimoIngreso: string | null
}

type CurrentSessionResponse = {
  usuario: AdminSessionUser
  autenticado: boolean
  refrescada: boolean
}

function buildAdminCookieHeader(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const accessToken = cookieStore.get(ADMIN_COOKIE_NAMES.access)?.value
  const refreshToken = cookieStore.get(ADMIN_COOKIE_NAMES.refresh)?.value

  const items = [
    accessToken ? `${ADMIN_COOKIE_NAMES.access}=${accessToken}` : null,
    refreshToken ? `${ADMIN_COOKIE_NAMES.refresh}=${refreshToken}` : null,
  ].filter(Boolean)

  return items.join('; ')
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const cookieHeader = buildAdminCookieHeader(cookieStore)

  if (!cookieHeader) {
    return null
  }

  try {
    const response = await fetch(`${getServerBackendUrl()}/api/admin/sessions/current`, {
      method: 'GET',
      headers: {
        Cookie: cookieHeader,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const payload = (await response.json()) as {
      ok: boolean
      datos?: CurrentSessionResponse
    }

    return payload.datos?.usuario ?? null
  } catch {
    return null
  }
}
