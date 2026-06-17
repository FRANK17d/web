import 'server-only'

import { createClient } from '@insforge/sdk'
import { getInsforgeAnonKey, getInsforgeUrl } from '@/lib/admin-auth/config'

// Cliente de InsForge en modo servidor: no persiste sesión en disco ni en
// cookies del SDK. Cada request construye su propio cliente y, si hace falta
// actuar como el admin autenticado, le pasa su access token.
export function createInsforgeServerClient(accessToken?: string | null) {
  return createClient({
    baseUrl: getInsforgeUrl(),
    anonKey: getInsforgeAnonKey(),
    isServerMode: true,
    edgeFunctionToken: accessToken ?? undefined,
  })
}
