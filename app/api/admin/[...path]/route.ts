import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'http://localhost:4000'

/**
 * Headers we forward from the browser request to the backend.
 * Cookie is critical so the backend can read auth tokens.
 * Origin / Referer are required by requireTrustedOrigin on the backend.
 */
const FORWARDED_HEADERS = [
  'cookie',
  'content-type',
  'origin',
  'referer',
  'user-agent',
  'x-forwarded-for',
] as const

async function proxyToBackend(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  const url = new URL(`/api/admin/${path.join('/')}`, BACKEND_URL)

  // Forward query parameters
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value)
  })

  const headers = new Headers()

  for (const name of FORWARDED_HEADERS) {
    const value = request.headers.get(name)
    if (value) headers.set(name, value)
  }

  // Ensure X-Forwarded-For reaches the backend for rate-limiting / audit
  if (!headers.has('x-forwarded-for')) {
    const ip = request.headers.get('x-real-ip')
    if (ip) headers.set('x-forwarded-for', ip)
  }

  const init: RequestInit = { method: request.method, headers }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.arrayBuffer()
  }

  let backendResponse: Response

  try {
    backendResponse = await fetch(url, init)
  } catch {
    return new Response(
      JSON.stringify({
        ok: false,
        error: { mensaje: 'No se pudo conectar con el backend administrativo.' },
      }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    )
  }

  // Build response — forward essential headers + all Set-Cookie headers
  const responseHeaders = new Headers()

  const contentType = backendResponse.headers.get('content-type')
  if (contentType) responseHeaders.set('content-type', contentType)

  const cacheControl = backendResponse.headers.get('cache-control')
  if (cacheControl) responseHeaders.set('cache-control', cacheControl)

  const xContentTypeOptions = backendResponse.headers.get('x-content-type-options')
  if (xContentTypeOptions) responseHeaders.set('x-content-type-options', xContentTypeOptions)

  // Forward Set-Cookie headers (critical for auth cookies)
  for (const cookie of backendResponse.headers.getSetCookie()) {
    responseHeaders.append('set-cookie', cookie)
  }

  return new Response(backendResponse.body, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: responseHeaders,
  })
}

export const GET = proxyToBackend
export const POST = proxyToBackend
export const PUT = proxyToBackend
export const PATCH = proxyToBackend
export const DELETE = proxyToBackend
