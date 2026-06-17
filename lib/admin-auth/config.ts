// ── Ruta del panel administrativo ──
// Slug poco adivinable: la protección real es la auth + el rol admin,
// pero evitamos un nombre obvio (/admin, /administracion) y NO lo
// publicamos en robots.txt ni en enlaces públicos.
// Para cambiar la ruta: renombra la carpeta app/<slug> y actualiza
// ADMIN_BASE_PATH + el matcher de proxy.ts (debe ser estático).
export const ADMIN_BASE_PATH = '/gestion-x7k2m9'
export const ADMIN_LOGIN_PATH = `${ADMIN_BASE_PATH}/iniciar-sesion`
export const ADMIN_RECOVERY_PATH = `${ADMIN_BASE_PATH}/olvide-mi-contrasena`

export const ADMIN_COOKIE_NAMES = {
  access: 'toke_admin_access_token',
  refresh: 'toke_admin_refresh_token',
} as const

// El access token de InsForge vive ~1h; el refresh varios días. Cuotas
// generosas en la cookie para no expirar la sesión antes que el token.
export const ADMIN_COOKIE_MAX_AGE = {
  access: 60 * 60, // 1 hora
  refresh: 60 * 60 * 24 * 30, // 30 días
} as const

export function getInsforgeUrl() {
  const value = process.env.INSFORGE_URL ?? process.env.NEXT_PUBLIC_INSFORGE_URL

  if (!value) {
    throw new Error('Falta configurar INSFORGE_URL en web.')
  }

  return value
}

export function getInsforgeAnonKey() {
  const value = process.env.INSFORGE_ANON_KEY

  if (!value) {
    throw new Error('Falta configurar INSFORGE_ANON_KEY en web.')
  }

  return value
}

// Solo permite redirecciones internas dentro del panel. Bloquea
// open-redirects (//evil.com), rutas externas y caracteres nulos.
export function sanitizeAdminRedirect(path: string | null | undefined) {
  if (
    !path ||
    !path.startsWith(`${ADMIN_BASE_PATH}/`) ||
    path.startsWith('//') ||
    path.includes('\0') ||
    path.includes('\\')
  ) {
    return ADMIN_BASE_PATH
  }

  return path
}
