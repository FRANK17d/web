import { getBrowserBackendUrl } from '@/lib/admin-auth/config'

type BackendApiResult<T> = {
  ok: boolean
  status: number
  data: T | null
  error: string | null
}

export async function callAdminApi<T>(path: string, init?: RequestInit): Promise<BackendApiResult<T>> {
  try {
    const response = await fetch(`${getBrowserBackendUrl()}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...(init?.headers ?? {}),
      },
    })

    const payload = (await response.json().catch(() => null)) as
      | { ok?: boolean; datos?: T; error?: { mensaje?: string } }
      | null

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        data: null,
        error: payload?.error?.mensaje || 'No se pudo completar la solicitud.',
      }
    }

    return {
      ok: true,
      status: response.status,
      data: payload?.datos ?? null,
      error: null,
    }
  } catch {
    return {
      ok: false,
      status: 0,
      data: null,
      error: 'No se pudo conectar con el backend administrativo.',
    }
  }
}
