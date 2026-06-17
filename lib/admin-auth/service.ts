import 'server-only'

import { createInsforgeServerClient } from '@/lib/admin-auth/insforge'
import { AdminAuthError, mapInsforgeAuthError } from '@/lib/admin-auth/errors'
import {
  buildAdminUser,
  findEligibleAdminByAuthUserId,
  findEligibleAdminByEmail,
  type AdminSessionUser,
} from '@/lib/admin-auth/repository'

export type AdminSession = {
  usuario: AdminSessionUser
  accessToken: string
  refreshToken: string | null
  refrescada: boolean
}

type AuthUserLike = { id: string; email?: string | null }

async function invalidateSession(accessToken?: string | null) {
  if (!accessToken) return
  try {
    await createInsforgeServerClient(accessToken).auth.signOut()
  } catch {
    // best-effort
  }
}

// Tras autenticar contra InsForge, confirmamos que el usuario es un admin
// activo en `profiles`. Si no lo es, cerramos la sesión recién creada para
// no dejar tokens válidos colgando, y negamos el acceso.
async function resolveEligibleAdminOrThrow(authUser: AuthUserLike, accessToken: string) {
  const admin = await findEligibleAdminByAuthUserId(authUser.id)

  if (!admin) {
    await invalidateSession(accessToken)
    throw new AdminAuthError(403, 'ADMIN_NO_AUTORIZADO', 'Acceso denegado. Solo administradores activos.')
  }

  return admin
}

async function buildSessionFromRefresh(refreshToken: string): Promise<AdminSession> {
  const { data, error } = await createInsforgeServerClient().auth.refreshSession({ refreshToken })

  if (error || !data?.accessToken || !data.user) {
    throw new AdminAuthError(401, 'SESION_INVALIDA', 'No se pudo refrescar la sesión administrativa.')
  }

  const admin = await resolveEligibleAdminOrThrow(data.user, data.accessToken)

  return {
    usuario: buildAdminUser(admin),
    accessToken: data.accessToken,
    refreshToken: data.refreshToken ?? refreshToken,
    refrescada: true,
  }
}

export async function iniciarSesionAdmin(input: {
  correo: string
  contrasena: string
}): Promise<AdminSession> {
  const { data, error } = await createInsforgeServerClient().auth.signInWithPassword({
    email: input.correo,
    password: input.contrasena,
  })

  if (error || !data?.accessToken || !data.user) {
    throw mapInsforgeAuthError(error)
  }

  const admin = await resolveEligibleAdminOrThrow(data.user, data.accessToken)

  return {
    usuario: buildAdminUser(admin),
    accessToken: data.accessToken,
    refreshToken: data.refreshToken ?? null,
    refrescada: false,
  }
}

export async function obtenerSesionAdmin(input: {
  accessToken?: string | null
  refreshToken?: string | null
}): Promise<AdminSession> {
  if (!input.accessToken && !input.refreshToken) {
    throw new AdminAuthError(401, 'SESION_REQUERIDA', 'No hay una sesión administrativa activa.')
  }

  if (input.accessToken) {
    const { data, error } = await createInsforgeServerClient(input.accessToken).auth.getCurrentUser()

    if (!error && data?.user) {
      const admin = await resolveEligibleAdminOrThrow(data.user, input.accessToken)

      return {
        usuario: buildAdminUser(admin),
        accessToken: input.accessToken,
        refreshToken: input.refreshToken ?? null,
        refrescada: false,
      }
    }
  }

  if (!input.refreshToken) {
    throw new AdminAuthError(401, 'SESION_EXPIRADA', 'La sesión administrativa expiró.')
  }

  return buildSessionFromRefresh(input.refreshToken)
}

export async function cerrarSesionAdmin(input: {
  accessToken?: string | null
  refreshToken?: string | null
}): Promise<void> {
  if (!input.accessToken && !input.refreshToken) return

  // Resolvemos una sesión válida (refrescando si hace falta) para invalidar
  // el token correcto del lado de InsForge.
  const session = await obtenerSesionAdmin({
    accessToken: input.accessToken,
    refreshToken: input.refreshToken,
  }).catch(() => null)

  await invalidateSession(session?.accessToken ?? input.accessToken)
}

export async function solicitarRestablecimientoAdmin(input: { correo: string }): Promise<void> {
  // Anti-enumeración: solo enviamos el correo si es un admin elegible, pero
  // el handler responde siempre OK para no revelar qué correos existen.
  const admin = await findEligibleAdminByEmail(input.correo)

  if (!admin) return

  const { error } = await createInsforgeServerClient().auth.sendResetPasswordEmail({
    email: input.correo,
  })

  if (error) {
    throw mapInsforgeAuthError(error)
  }
}

export async function verificarCodigoRestablecimientoAdmin(input: {
  correo: string
  codigo: string
}): Promise<{ token: string; expiraEn: string }> {
  // Solo admins elegibles pueden canjear un código (mensaje neutro si no).
  const admin = await findEligibleAdminByEmail(input.correo)

  if (!admin) {
    throw new AdminAuthError(400, 'CODIGO_INVALIDO', 'El código de verificación no es válido o expiró.')
  }

  const { data, error } = await createInsforgeServerClient().auth.exchangeResetPasswordToken({
    email: input.correo,
    code: input.codigo,
  })

  if (error || !data?.token || !data.expiresAt) {
    throw mapInsforgeAuthError(error)
  }

  return { token: data.token, expiraEn: data.expiresAt }
}

export async function restablecerContrasenaAdmin(input: {
  token: string
  nuevaContrasena: string
}): Promise<void> {
  const { error } = await createInsforgeServerClient().auth.resetPassword({
    otp: input.token,
    newPassword: input.nuevaContrasena,
  })

  if (error) {
    throw mapInsforgeAuthError(error)
  }
}
