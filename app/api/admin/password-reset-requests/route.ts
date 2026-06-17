import { adminRoute, assertSameOrigin, jsonOk, parseJson } from '@/lib/admin-auth/http'
import { resetRequestSchema } from '@/lib/admin-auth/schemas'
import { solicitarRestablecimientoAdmin } from '@/lib/admin-auth/service'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// POST /api/admin/password-reset-requests — envía un código de recuperación.
// Responde siempre OK (anti-enumeración de correos).
export const POST = adminRoute(async (request) => {
  assertSameOrigin(request)
  const { correo } = await parseJson(request, resetRequestSchema)

  await solicitarRestablecimientoAdmin({ correo })

  return jsonOk({ solicitado: true })
})
