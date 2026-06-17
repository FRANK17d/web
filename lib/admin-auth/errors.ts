// Error de dominio para la auth admin. Los route handlers lo traducen a
// JSON { ok:false, error:{ codigo, mensaje } } con su status HTTP.
export class AdminAuthError extends Error {
  readonly status: number
  readonly codigo: string

  constructor(status: number, codigo: string, mensaje: string) {
    super(mensaje)
    this.name = 'AdminAuthError'
    this.status = status
    this.codigo = codigo
  }
}

type InsforgeLikeError = {
  statusCode?: number
  message?: string
  error?: string
} | null | undefined

// Nunca reenviamos el mensaje crudo de InsForge al cliente: puede filtrar
// detalles internos. Mapeamos a mensajes neutros en español.
export function mapInsforgeAuthError(error: InsforgeLikeError): AdminAuthError {
  if (!error) {
    return new AdminAuthError(500, 'AUTH_ERROR', 'No se pudo completar la autenticación.')
  }

  if (error.statusCode === 401) {
    return new AdminAuthError(401, 'CREDENCIALES_INVALIDAS', 'Correo o contraseña inválidos.')
  }

  if (error.statusCode === 403) {
    return new AdminAuthError(403, 'CORREO_NO_VERIFICADO', 'El correo administrativo aún no está verificado.')
  }

  if (error.statusCode === 429) {
    return new AdminAuthError(429, 'DEMASIADOS_INTENTOS', 'Demasiados intentos. Espera un momento e inténtalo de nuevo.')
  }

  if (error.statusCode === 400) {
    return new AdminAuthError(400, 'SOLICITUD_INVALIDA', 'La solicitud es inválida.')
  }

  if (error.statusCode && error.statusCode >= 500) {
    console.error('[admin-auth] InsForge upstream error:', error.message ?? error.error)
  }

  return new AdminAuthError(500, 'AUTH_ERROR', 'No se pudo completar la autenticación.')
}
