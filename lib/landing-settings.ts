import 'server-only'

import { cache } from 'react'
import { createInsforgeServerClient } from '@/lib/admin-auth/insforge'

export type LandingSettings = {
  brandColor: string
  logoUrl: string
  heroImageUrl: string
  heroTitle: string
  heroSubtitle: string
  promoBanner: string
  androidUrl: string
  iosUrl: string
}

const DEFAULT_SETTINGS: LandingSettings = {
  brandColor: '#C8102E',
  logoUrl: '',
  heroImageUrl: '/hero-mockup.webp',
  heroTitle: 'La app para el\nmantenimiento de tu\nhogar',
  heroSubtitle:
    'Toke+ te conecta con plomeros, electricistas, herreros, albañiles, jardineros, fleteros y más...',
  promoBanner: 'Disponible en Android y próximamente en iOS. El servicio que necesitas, a un toque.',
  androidUrl: '#descargar',
  iosUrl: '#descargar',
}

type AppSettingRow = {
  key: string
  value: unknown
}

function asRecord(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function stringValue(value: unknown, fallback: string) {
  return typeof value === 'string' ? value.trim() || fallback : fallback
}

function hexColorValue(value: unknown, fallback: string) {
  if (typeof value !== 'string') return fallback
  const color = value.trim()
  return /^#[0-9a-f]{6}$/i.test(color) ? color : fallback
}

export const getLandingSettings = cache(async (): Promise<LandingSettings> => {
  const client = createInsforgeServerClient()
  const { data, error } = await client.database
    .from('app_settings')
    .select('key, value')

  if (error || !data) return DEFAULT_SETTINGS

  const rows = (data as AppSettingRow[]).reduce<Record<string, Record<string, unknown>>>(
    (acc, row) => {
      if (!['branding', 'landing', 'store_links'].includes(row.key)) return acc
      return { ...acc, [row.key]: asRecord(row.value) }
    },
    {},
  )

  const branding = rows.branding ?? {}
  const landing = rows.landing ?? {}
  const storeLinks = rows.store_links ?? {}

  return {
    brandColor: hexColorValue(branding.brand_color, DEFAULT_SETTINGS.brandColor),
    logoUrl: stringValue(branding.logo_url, DEFAULT_SETTINGS.logoUrl),
    heroImageUrl: stringValue(branding.hero_image_url, DEFAULT_SETTINGS.heroImageUrl),
    heroTitle: stringValue(landing.hero_title, DEFAULT_SETTINGS.heroTitle),
    heroSubtitle: stringValue(landing.hero_subtitle, DEFAULT_SETTINGS.heroSubtitle),
    promoBanner: stringValue(landing.promo_banner, DEFAULT_SETTINGS.promoBanner),
    androidUrl: stringValue(storeLinks.android, DEFAULT_SETTINGS.androidUrl),
    iosUrl: stringValue(storeLinks.ios, DEFAULT_SETTINGS.iosUrl),
  }
})

// ─── Integration Settings ─────────────────────────────────────

export type IntegrationSettings = {
  mercadopagoSandbox: boolean
  commissionRate: number
  maxPhotosPerRequest: number
  autoApproveRequests: boolean
}

const DEFAULT_INTEGRATIONS: IntegrationSettings = {
  mercadopagoSandbox: true,
  commissionRate: 0,
  maxPhotosPerRequest: 5,
  autoApproveRequests: false,
}

export const getIntegrationSettings = cache(async (): Promise<IntegrationSettings> => {
  const client = createInsforgeServerClient()
  const { data, error } = await client.database
    .from('app_settings')
    .select('key, value')
    .eq('key', 'integrations')
    .maybeSingle()

  if (error || !data) return DEFAULT_INTEGRATIONS

  const row = data as AppSettingRow
  const v = asRecord(row.value)

  return {
    mercadopagoSandbox: typeof v.mercadopago_sandbox === 'boolean' ? v.mercadopago_sandbox : DEFAULT_INTEGRATIONS.mercadopagoSandbox,
    commissionRate: typeof v.commission_rate === 'number' ? v.commission_rate : DEFAULT_INTEGRATIONS.commissionRate,
    maxPhotosPerRequest: typeof v.max_photos_per_request === 'number' ? v.max_photos_per_request : DEFAULT_INTEGRATIONS.maxPhotosPerRequest,
    autoApproveRequests: typeof v.auto_approve_requests === 'boolean' ? v.auto_approve_requests : DEFAULT_INTEGRATIONS.autoApproveRequests,
  }
})
