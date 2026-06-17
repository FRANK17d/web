import { adminRoute, assertSameOrigin, jsonOk, parseJson } from '@/lib/admin-auth/http'
import { resetSchema } from '@/lib/admin-auth/schemas'
import { restablecerContrasenaAdmin } from '@/lib/admin-auth/service'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// POST /api/admin/password-resets — fija la nueva contraseña con el token
// obtenido tras validar el código.
export const POST = adminRoute(async (request) => {
  assertSameOrigin(request)
  const { token, nuevaContrasena } = await parseJson(request, resetSchema)

  await restablecerContrasenaAdmin({ token, nuevaContrasena })

  return jsonOk({ actualizada: true })
})
