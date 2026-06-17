import { adminRoute, assertSameOrigin, jsonOk, parseJson } from '@/lib/admin-auth/http'
import { loginSchema } from '@/lib/admin-auth/schemas'
import { iniciarSesionAdmin } from '@/lib/admin-auth/service'
import { setAdminSessionCookies } from '@/lib/admin-auth/cookies'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// POST /api/admin/sessions — iniciar sesión administrativa.
export const POST = adminRoute(async (request) => {
  assertSameOrigin(request)
  const { correo, contrasena } = await parseJson(request, loginSchema)

  const session = await iniciarSesionAdmin({ correo, contrasena })

  await setAdminSessionCookies({
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  })

  return jsonOk({ usuario: session.usuario, autenticado: true })
})
