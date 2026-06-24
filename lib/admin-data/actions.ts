'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { createInsforgeServerClient } from '@/lib/admin-auth/insforge'
import { ADMIN_COOKIE_NAMES } from '@/lib/admin-auth/config'
import { getAdminSession } from '@/lib/admin-auth/server'

async function getAuthenticatedClient() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ADMIN_COOKIE_NAMES.access)?.value ?? null
  return createInsforgeServerClient(accessToken)
}

type AdminRpcResult = {
  success?: boolean
  message?: string
  [key: string]: unknown
}

function formString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function formColor(formData: FormData, key: string, fallback: string) {
  const value = formString(formData, key)
  return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback
}

function formInt(formData: FormData, key: string) {
  const value = Number.parseInt(formString(formData, key), 10)
  return Number.isFinite(value) ? value : null
}

function formNumber(formData: FormData, key: string) {
  const value = Number.parseFloat(formString(formData, key))
  return Number.isFinite(value) ? value : null
}

function slugifyCategoryName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function validateCategoryInput(formData: FormData) {
  const name = formString(formData, 'name')
  const emoji = formString(formData, 'emoji') || null
  const slug = slugifyCategoryName(name)

  if (!name || !slug) {
    return { error: 'Ingresa un nombre válido para la categoría.' }
  }

  return { name, emoji, slug }
}

function validateCreditPackageInput(formData: FormData) {
  const name = formString(formData, 'name')
  const credits = formInt(formData, 'credits')
  const pricePen = formNumber(formData, 'pricePen')
  const sortOrder = formInt(formData, 'sortOrder') ?? 0

  if (!name) return { error: 'Ingresa un nombre para el paquete.' }
  if (credits === null || credits <= 0) return { error: 'Los créditos deben ser mayores a 0.' }
  if (pricePen === null || pricePen < 0) return { error: 'El precio debe ser 0 o mayor.' }

  return { name, credits, pricePen, sortOrder }
}

function validateSubscriptionPlanInput(formData: FormData) {
  const name = formString(formData, 'name')
  const durationDays = formInt(formData, 'durationDays')
  const pricePen = formNumber(formData, 'pricePen')
  const includedCredits = formInt(formData, 'includedCredits') ?? 0
  const sortOrder = formInt(formData, 'sortOrder') ?? 0

  if (!name) return { error: 'Ingresa un nombre para el plan.' }
  if (durationDays === null || durationDays <= 0) return { error: 'La duración debe ser mayor a 0 días.' }
  if (pricePen === null || pricePen < 0) return { error: 'El precio debe ser 0 o mayor.' }
  if (includedCredits < 0) return { error: 'Los créditos incluidos no pueden ser negativos.' }

  return { name, durationDays, pricePen, includedCredits, sortOrder }
}

export async function approveRequest(requestId: string) {
  const client = await getAuthenticatedClient()
  const { data, error } = await client.database.rpc('review_service_request', {
    p_request_id: requestId,
    p_approve: true,
    p_reason: null,
  })
  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9/reservas')
  revalidatePath('/gestion-x7k2m9')
  return (data as AdminRpcResult | null) ?? { success: true }
}

export async function rejectRequest(requestId: string, reason: string) {
  const client = await getAuthenticatedClient()
  const { data, error } = await client.database.rpc('review_service_request', {
    p_request_id: requestId,
    p_approve: false,
    p_reason: reason,
  })
  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9/reservas')
  revalidatePath('/gestion-x7k2m9')
  return (data as AdminRpcResult | null) ?? { success: true }
}

export async function verifyTechnician(techProfileId: string) {
  const client = await getAuthenticatedClient()
  const { data, error } = await client.database.rpc('review_technician_verification', {
    p_technician_id: techProfileId,
    p_approve: true,
    p_reason: null,
  })
  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9/verificaciones')
  revalidatePath('/gestion-x7k2m9')
  return (data as AdminRpcResult | null) ?? { success: true }
}

export async function rejectTechnician(techProfileId: string, reason: string) {
  const client = await getAuthenticatedClient()
  const { data, error } = await client.database.rpc('review_technician_verification', {
    p_technician_id: techProfileId,
    p_approve: false,
    p_reason: reason,
  })
  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9/verificaciones')
  revalidatePath('/gestion-x7k2m9')
  return (data as AdminRpcResult | null) ?? { success: true }
}

export async function toggleUserActive(userId: string, active: boolean) {
  const client = await getAuthenticatedClient()
  const { error } = await client.database
    .from('profiles')
    .update({ is_active: active })
    .eq('id', userId)

  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9')
  return { success: true }
}

export async function updateSupportTicketStatus(
  ticketId: string,
  status: 'open' | 'in_progress' | 'closed'
) {
  const client = await getAuthenticatedClient()
  const { error } = await client.database
    .from('support_tickets')
    .update({ status })
    .eq('id', ticketId)

  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9/disputas')
  revalidatePath('/gestion-x7k2m9')
  return { success: true }
}

export async function replySupportTicket(formData: FormData) {
  const ticketId = formString(formData, 'ticketId')
  const body = formString(formData, 'body')

  if (!ticketId) return { success: false, message: 'Ticket inválido.' }
  if (!body) return { success: false, message: 'Escribe una respuesta.' }

  const admin = await getAdminSession()
  if (!admin) return { success: false, message: 'Sesión admin inválida.' }

  const client = await getAuthenticatedClient()
  const { error } = await client.database.from('ticket_messages').insert([
    {
      ticket_id: ticketId,
      sender_id: admin.id,
      body,
      is_admin: true,
    },
  ])

  if (error) return { success: false, message: error.message }

  await client.database
    .from('support_tickets')
    .update({ status: 'in_progress' })
    .eq('id', ticketId)

  revalidatePath('/gestion-x7k2m9/disputas')
  revalidatePath(`/gestion-x7k2m9/disputas/${ticketId}`)
  revalidatePath('/gestion-x7k2m9')
  return { success: true }
}

export async function createServiceCategory(formData: FormData) {
  const input = validateCategoryInput(formData)
  if ('error' in input) return { success: false, message: input.error }

  const client = await getAuthenticatedClient()
  const { error } = await client.database.from('service_categories').insert([
    {
      name: input.name,
      emoji: input.emoji,
      slug: input.slug,
      is_active: true,
    },
  ])

  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9/servicios')
  revalidatePath('/gestion-x7k2m9')
  return { success: true }
}

export async function updateServiceCategory(formData: FormData) {
  const id = formInt(formData, 'id')
  if (id === null) return { success: false, message: 'Categoría inválida.' }

  const input = validateCategoryInput(formData)
  if ('error' in input) return { success: false, message: input.error }

  const client = await getAuthenticatedClient()
  const { error } = await client.database
    .from('service_categories')
    .update({ name: input.name, emoji: input.emoji, slug: input.slug })
    .eq('id', id)

  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9/servicios')
  revalidatePath('/gestion-x7k2m9')
  return { success: true }
}

export async function toggleServiceCategory(categoryId: number, active: boolean) {
  const client = await getAuthenticatedClient()
  const { error } = await client.database
    .from('service_categories')
    .update({ is_active: active })
    .eq('id', categoryId)

  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9/servicios')
  revalidatePath('/gestion-x7k2m9')
  return { success: true }
}

// ─── Servicios (sub-servicios por categoría) ──────────────────

function validateServiceInput(formData: FormData): { name: string } | { error: string } {
  const name = String(formData.get('name') ?? '').trim()
  if (name.length < 2) return { error: 'Ingresa un nombre válido para el servicio.' }
  if (name.length > 120) return { error: 'El nombre es demasiado largo.' }
  return { name }
}

export async function createService(formData: FormData) {
  const categoryId = formInt(formData, 'category_id')
  if (categoryId === null) return { success: false, message: 'Categoría inválida.' }

  const input = validateServiceInput(formData)
  if ('error' in input) return { success: false, message: input.error }

  const client = await getAuthenticatedClient()
  const { error } = await client.database.from('services').insert([
    { category_id: categoryId, name: input.name, is_active: true },
  ])

  if (error) return { success: false, message: error.message }
  revalidatePath(`/gestion-x7k2m9/servicios/${categoryId}`)
  return { success: true }
}

export async function updateService(formData: FormData) {
  const id = formInt(formData, 'id')
  const categoryId = formInt(formData, 'category_id')
  if (id === null) return { success: false, message: 'Servicio inválido.' }

  const input = validateServiceInput(formData)
  if ('error' in input) return { success: false, message: input.error }

  const client = await getAuthenticatedClient()
  const { error } = await client.database
    .from('services')
    .update({ name: input.name })
    .eq('id', id)

  if (error) return { success: false, message: error.message }
  if (categoryId !== null) revalidatePath(`/gestion-x7k2m9/servicios/${categoryId}`)
  return { success: true }
}

export async function toggleService(id: number, active: boolean, categoryId: number) {
  const client = await getAuthenticatedClient()
  const { error } = await client.database
    .from('services')
    .update({ is_active: active })
    .eq('id', id)

  if (error) return { success: false, message: error.message }
  revalidatePath(`/gestion-x7k2m9/servicios/${categoryId}`)
  return { success: true }
}

export async function deleteService(id: number, categoryId: number) {
  const client = await getAuthenticatedClient()
  const { error } = await client.database.from('services').delete().eq('id', id)

  if (error) return { success: false, message: error.message }
  revalidatePath(`/gestion-x7k2m9/servicios/${categoryId}`)
  return { success: true }
}

export async function createCreditPackage(formData: FormData) {
  const input = validateCreditPackageInput(formData)
  if ('error' in input) return { success: false, message: input.error }

  const client = await getAuthenticatedClient()
  const { error } = await client.database.from('credit_packages').insert([
    {
      name: input.name,
      credits: input.credits,
      price_pen: input.pricePen,
      sort_order: input.sortOrder,
      is_active: true,
    },
  ])

  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9/creditos')
  revalidatePath('/gestion-x7k2m9')
  return { success: true }
}

export async function updateCreditPackage(formData: FormData) {
  const id = formInt(formData, 'id')
  if (id === null) return { success: false, message: 'Paquete inválido.' }

  const input = validateCreditPackageInput(formData)
  if ('error' in input) return { success: false, message: input.error }

  const client = await getAuthenticatedClient()
  const { error } = await client.database
    .from('credit_packages')
    .update({
      name: input.name,
      credits: input.credits,
      price_pen: input.pricePen,
      sort_order: input.sortOrder,
    })
    .eq('id', id)

  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9/creditos')
  revalidatePath('/gestion-x7k2m9')
  return { success: true }
}

export async function toggleCreditPackage(packageId: number, active: boolean) {
  const client = await getAuthenticatedClient()
  const { error } = await client.database
    .from('credit_packages')
    .update({ is_active: active })
    .eq('id', packageId)

  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9/creditos')
  revalidatePath('/gestion-x7k2m9')
  return { success: true }
}

export async function createSubscriptionPlan(formData: FormData) {
  const input = validateSubscriptionPlanInput(formData)
  if ('error' in input) return { success: false, message: input.error }

  const client = await getAuthenticatedClient()
  const { error } = await client.database.from('subscription_plans').insert([
    {
      name: input.name,
      duration_days: input.durationDays,
      price_pen: input.pricePen,
      included_credits: input.includedCredits,
      benefits: { badge: true, priority_listing: true },
      sort_order: input.sortOrder,
      is_active: true,
    },
  ])

  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9/tokepro')
  revalidatePath('/gestion-x7k2m9')
  return { success: true }
}

export async function updateSubscriptionPlan(formData: FormData) {
  const id = formInt(formData, 'id')
  if (id === null) return { success: false, message: 'Plan inválido.' }

  const input = validateSubscriptionPlanInput(formData)
  if ('error' in input) return { success: false, message: input.error }

  const client = await getAuthenticatedClient()
  const { error } = await client.database
    .from('subscription_plans')
    .update({
      name: input.name,
      duration_days: input.durationDays,
      price_pen: input.pricePen,
      included_credits: input.includedCredits,
      sort_order: input.sortOrder,
    })
    .eq('id', id)

  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9/tokepro')
  revalidatePath('/gestion-x7k2m9')
  return { success: true }
}

export async function toggleSubscriptionPlan(planId: number, active: boolean) {
  const client = await getAuthenticatedClient()
  const { error } = await client.database
    .from('subscription_plans')
    .update({ is_active: active })
    .eq('id', planId)

  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9/tokepro')
  revalidatePath('/gestion-x7k2m9')
  return { success: true }
}

export async function updateLandingSettings(formData: FormData) {
  const client = await getAuthenticatedClient()
  const branding = {
    brand_color: formColor(formData, 'brandColor', '#C8102E'),
    logo_url: formString(formData, 'logoUrl') || null,
    hero_image_url: formString(formData, 'heroImageUrl') || null,
  }
  const landing = {
    hero_title: formString(formData, 'heroTitle'),
    hero_subtitle: formString(formData, 'heroSubtitle'),
    promo_banner: formString(formData, 'promoBanner') || null,
  }
  const storeLinks = {
    android: formString(formData, 'androidUrl'),
    ios: formString(formData, 'iosUrl'),
  }

  const updates = [
    client.database.from('app_settings').update({ value: branding }).eq('key', 'branding'),
    client.database.from('app_settings').update({ value: landing }).eq('key', 'landing'),
    client.database.from('app_settings').update({ value: storeLinks }).eq('key', 'store_links'),
  ]

  const results = await Promise.all(updates)
  const error = results.find((result) => result.error)?.error
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/gestion-x7k2m9/configuracion')
}
