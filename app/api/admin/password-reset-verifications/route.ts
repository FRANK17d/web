import { adminRoute, assertSameOrigin, jsonOk, parseJson } from '@/lib/admin-auth/http'
import { resetVerifySchema } from '@/lib/admin-auth/schemas'
import { verificarCodigoRestablecimientoAdmin } from '@/lib/admin-auth/service'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// POST /api/admin/password-reset-verifications — canjea el código de 6 dígitos
// por un token de restablecimiento de un solo uso.
export const POST = adminRoute(async (request) => {
  assertSameOrigin(request)
  const { correo, codigo } = await parseJson(request, resetVerifySchema)

  const resultado = await verificarCodigoRestablecimientoAdmin({ correo, codigo })

  return jsonOk({ token: resultado.token, expiraEn: resultado.expiraEn })
})
