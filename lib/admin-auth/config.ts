export const ADMIN_COOKIE_NAMES = {
  access: 'maestroya_admin_access_token',
  refresh: 'maestroya_admin_refresh_token',
} as const

export function getServerBackendUrl() {
  const value = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL

  if (!value) {
    throw new Error('Falta configurar BACKEND_URL o NEXT_PUBLIC_BACKEND_URL en web.')
  }

  return value
}

export function getBrowserBackendUrl() {
  const value = process.env.NEXT_PUBLIC_BACKEND_URL

  if (!value) {
    throw new Error('Falta configurar NEXT_PUBLIC_BACKEND_URL en web.')
  }

  return value
}

export function sanitizeAdminRedirect(path: string | null | undefined) {
  if (!path || !path.startsWith('/') || path.startsWith('//')) {
    return '/administracion'
  }

  return path
}
