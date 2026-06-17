import { AdminAuthError } from '@/lib/admin-auth/errors'
import { adminRoute } from '@/lib/admin-auth/http'
import { getInsforgeUrl } from '@/lib/admin-auth/config'
import { readAdminSessionCookies, setAdminSessionCookies } from '@/lib/admin-auth/cookies'
import { obtenerSesionAdmin } from '@/lib/admin-auth/service'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const DOCUMENT_PATH_PATTERN = /^technicians\/[0-9a-fA-F-]{36}\/verification\/[A-Za-z0-9._-]+$/

export const GET = adminRoute(async (request) => {
  const url = new URL(request.url)
  const filePath = url.searchParams.get('path')?.trim() ?? ''

  if (!DOCUMENT_PATH_PATTERN.test(filePath)) {
    throw new AdminAuthError(400, 'DOCUMENTO_INVALIDO', 'Documento inválido.')
  }

  const { accessToken, refreshToken } = await readAdminSessionCookies()
  const session = await obtenerSesionAdmin({ accessToken, refreshToken })

  if (session.refrescada) {
    await setAdminSessionCookies({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    })
  }

  const storageUrl = `${getInsforgeUrl()}/api/storage/buckets/verification-docs/objects/${encodeURIComponent(filePath)}`
  const upstream = await fetch(storageUrl, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
    cache: 'no-store',
  })

  if (!upstream.ok) {
    throw new AdminAuthError(upstream.status, 'DOCUMENTO_NO_DISPONIBLE', 'No se pudo abrir el documento.')
  }

  const filename = filePath.split('/').pop()?.replace(/[^A-Za-z0-9._-]/g, '_') ?? 'documento'
  const headers = new Headers()
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Content-Type', upstream.headers.get('content-type') ?? 'application/octet-stream')
  headers.set('Content-Disposition', `inline; filename="${filename}"`)

  return new Response(upstream.body, { status: 200, headers })
})
