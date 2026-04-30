import 'server-only'

import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAMES, getServerBackendUrl } from '@/lib/admin-auth/config'

// ── Types matching backend response shapes ──

export type Paginacion = {
  pagina: number
  limite: number
  total: number
  totalPaginas: number
}

export type ApiOk<T> = { ok: true; datos: T }
export type ApiPaginated<T> = { ok: true; datos: T[]; paginacion: Paginacion }
export type ApiError = { ok: false; codigo?: string; mensaje?: string }

// ── Server-side fetch to backend (forwards admin cookies) ──

async function buildCookieHeader(): Promise<string> {
  const store = await cookies()
  const access = store.get(ADMIN_COOKIE_NAMES.access)?.value
  const refresh = store.get(ADMIN_COOKIE_NAMES.refresh)?.value
  return [
    access ? `${ADMIN_COOKIE_NAMES.access}=${access}` : null,
    refresh ? `${ADMIN_COOKIE_NAMES.refresh}=${refresh}` : null,
  ]
    .filter(Boolean)
    .join('; ')
}

/**
 * Fetch a backend endpoint from a Server Component / Server Action.
 * Automatically forwards admin cookies and returns parsed JSON.
 *
 * @param path  - path relative to backend, e.g. "/api/admin/dashboard/stats"
 * @param opts  - optional RequestInit overrides (method, body, etc.)
 * @returns     - parsed JSON body (caller should narrow to ApiOk / ApiPaginated)
 */
export async function adminFetch<T = unknown>(
  path: string,
  opts?: RequestInit,
): Promise<T> {
  const cookieHeader = await buildCookieHeader()
  const url = `${getServerBackendUrl()}${path}`

  const res = await fetch(url, {
    ...opts,
    headers: {
      Cookie: cookieHeader,
      'Content-Type': 'application/json',
      ...(opts?.headers ?? {}),
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(
      (body as Record<string, string>).mensaje ??
        `Backend responded ${res.status}`,
    )
  }

  return res.json() as Promise<T>
}

// ── Typed convenience helpers ──

export async function adminGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  const qs = params
    ? '?' +
      new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== '')
          .map(([k, v]) => [k, String(v)]),
      ).toString()
    : ''
  return adminFetch<T>(`${path}${qs}`)
}

export async function adminPatch<T>(
  path: string,
  body: unknown,
): Promise<T> {
  return adminFetch<T>(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export async function adminPost<T>(
  path: string,
  body: unknown,
): Promise<T> {
  return adminFetch<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
