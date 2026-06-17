import 'server-only'

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { AdminAuthError } from '@/lib/admin-auth/errors'

const noStoreHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'X-Content-Type-Options': 'nosniff',
}

export function jsonOk<T>(datos: T, status = 200) {
  return NextResponse.json({ ok: true, datos }, { status, headers: noStoreHeaders })
}

export function jsonError(status: number, codigo: string, mensaje: string) {
  return NextResponse.json(
    { ok: false, error: { codigo, mensaje } },
    { status, headers: noStoreHeaders },
  )
}

// Rechaza solicitudes mutantes cuyo Origin no sea el mismo host (defensa CSRF
// en profundidad; las cookies ya son SameSite=Lax). Permite same-origin y
// herramientas server-to-server sin Origin solo en GET (no llega aquí).
export function assertSameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) {
    // Navegadores siempre mandan Origin en POST/DELETE cross-site. Su ausencia
    // suele ser same-origin antiguo o cliente no-navegador: lo permitimos.
    return
  }

  let originHost: string
  try {
    originHost = new URL(origin).host
  } catch {
    throw new AdminAuthError(403, 'ORIGEN_NO_CONFIABLE', 'Origen de la solicitud no confiable.')
  }

  const host = request.headers.get('host')
  if (host && originHost !== host) {
    throw new AdminAuthError(403, 'ORIGEN_NO_CONFIABLE', 'Origen de la solicitud no confiable.')
  }
}

export async function parseJson<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    throw new AdminAuthError(400, 'JSON_INVALIDO', 'El cuerpo de la solicitud no es válido.')
  }

  const result = schema.safeParse(body)
  if (!result.success) {
    const mensaje = result.error.issues[0]?.message ?? 'Datos de la solicitud inválidos.'
    throw new AdminAuthError(400, 'VALIDACION', mensaje)
  }

  return result.data
}

// Envuelve un handler traduciendo AdminAuthError a JSON y evitando filtrar
// stack traces u otros detalles internos.
export function adminRoute(handler: (request: Request) => Promise<Response>) {
  return async (request: Request): Promise<Response> => {
    try {
      return await handler(request)
    } catch (error) {
      if (error instanceof AdminAuthError) {
        return jsonError(error.status, error.codigo, error.message)
      }
      console.error('[admin-auth] error no controlado:', error)
      return jsonError(500, 'ERROR_INTERNO', 'Ocurrió un error inesperado. Inténtalo de nuevo.')
    }
  }
}
