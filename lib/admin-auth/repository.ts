import 'server-only'

import { createInsforgeServerClient } from '@/lib/admin-auth/insforge'

// Forma de la fila en la tabla `profiles` (InsForge). OJO: `id` ES el id del
// usuario de auth (auth.uid()); no hay columna auth_user_id separada.
type ProfileRow = {
  id: string
  role: 'admin' | 'client' | 'technician'
  first_name: string | null
  last_name: string | null
  email: string | null
  is_active: boolean
}

export type AdminSessionUser = {
  id: string
  authUserId: string
  email: string
  nombres: string
  apellidos: string
  nombreCompleto: string
  rol: 'admin'
  activo: boolean
  ultimoIngreso: string | null
}

const PROFILE_COLUMNS = ['id', 'role', 'first_name', 'last_name', 'email', 'is_active'].join(', ')

function isEligibleAdmin(row: ProfileRow | null): row is ProfileRow {
  return !!row && row.role === 'admin' && row.is_active === true
}

async function fetchProfile(filter: (q: ReturnType<typeof baseQuery>) => unknown) {
  const result = (await filter(baseQuery())) as {
    data: unknown
    error: unknown
  }

  if (result.error || !result.data) {
    return null
  }

  return result.data as ProfileRow
}

function baseQuery() {
  return createInsforgeServerClient().database.from('profiles').select(PROFILE_COLUMNS)
}

export async function findEligibleAdminByAuthUserId(authUserId: string) {
  const row = await fetchProfile((q) => q.eq('id', authUserId).maybeSingle())
  return isEligibleAdmin(row) ? row : null
}

export async function findEligibleAdminByEmail(email: string) {
  const row = await fetchProfile((q) => q.eq('email', email).maybeSingle())
  return isEligibleAdmin(row) ? row : null
}

export function buildAdminUser(row: ProfileRow): AdminSessionUser {
  const nombres = row.first_name?.trim() ?? ''
  const apellidos = row.last_name?.trim() ?? ''
  const nombreCompleto = `${nombres} ${apellidos}`.trim() || (row.email ?? 'Administrador')

  return {
    id: row.id,
    authUserId: row.id,
    email: row.email ?? '',
    nombres,
    apellidos,
    nombreCompleto,
    rol: 'admin',
    activo: row.is_active,
    ultimoIngreso: null,
  }
}
