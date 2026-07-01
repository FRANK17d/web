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
  revalidatePath('/gestion-x7k2m9/configuracion')
  return { success: true }
}

// ─── Integration Settings ─────────────────────────────────────

export async function updateIntegrationSettings(formData: FormData) {
  const client = await getAuthenticatedClient()

  const integrations = {
    mercadopago_sandbox: formString(formData, 'mercadopagoSandbox') === 'true',
    commission_rate: formNumber(formData, 'commissionRate') ?? 0,
    max_photos_per_request: formInt(formData, 'maxPhotosPerRequest') ?? 5,
    auto_approve_requests: formString(formData, 'autoApproveRequests') === 'true',
  }

  const { error } = await client.database
    .from('app_settings')
    .update({ value: integrations })
    .eq('key', 'integrations')

  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9/configuracion')
  return { success: true }
}

// ─── Image Upload (Storage) ───────────────────────────────────

export async function uploadBrandingImage(formData: FormData) {
  const file = formData.get('file') as File | null
  const imageType = formString(formData, 'imageType') // 'logo' | 'hero'

  if (!file || file.size === 0) return { success: false, message: 'Selecciona un archivo.' }
  if (file.size > 5 * 1024 * 1024) return { success: false, message: 'Máximo 5 MB.' }
  if (!file.type.startsWith('image/')) return { success: false, message: 'Solo se permiten imágenes.' }

  const ext = file.name.split('.').pop() || 'webp'
  const path = `${imageType}-${Date.now()}.${ext}`

  const client = await getAuthenticatedClient()

  const { error: uploadError } = await client.storage
    .from('branding')
    .upload(path, file)

  if (uploadError) return { success: false, message: uploadError.message }

  const publicUrl = client.storage.from('branding').getPublicUrl(path)
  if (!publicUrl) return { success: false, message: 'No se pudo obtener la URL publica.' }

  // Update the app_settings branding entry with the new URL
  const fieldKey = imageType === 'logo' ? 'logo_url' : 'hero_image_url'

  // First get current branding value
  const { data: currentData } = await client.database
    .from('app_settings')
    .select('value')
    .eq('key', 'branding')
    .maybeSingle()

  const currentBranding = (currentData?.value as Record<string, unknown>) ?? {}
  const updatedBranding = { ...currentBranding, [fieldKey]: publicUrl }

  const { error: updateError } = await client.database
    .from('app_settings')
    .update({ value: updatedBranding })
    .eq('key', 'branding')

  if (updateError) return { success: false, message: updateError.message }

  revalidatePath('/gestion-x7k2m9/configuracion')
  revalidatePath('/')
  return { success: true, url: publicUrl }
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

export async function toggleReviewVisibility(reviewId: string, visible: boolean) {
  const client = await getAuthenticatedClient()
  const { error } = await client.database
    .from('reviews')
    .update({ is_visible: visible })
    .eq('id', reviewId)

  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9/resenas')
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

// ─── Distritos ────────────────────────────────────────────────

export async function createDistrict(formData: FormData) {
  const name = formString(formData, 'name')
  const province = formString(formData, 'province')
  const department = formString(formData, 'department')
  const latitude = formNumber(formData, 'latitude')
  const longitude = formNumber(formData, 'longitude')

  if (!name) return { success: false, message: 'Ingresa un nombre para el distrito.' }

  const client = await getAuthenticatedClient()
  const { error } = await client.database.from('districts').insert([
    {
      name,
      province: province || null,
      department: department || null,
      latitude,
      longitude,
      is_active: true,
    },
  ])

  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9/distritos')
  return { success: true }
}

export async function updateDistrict(formData: FormData) {
  const id = formInt(formData, 'id')
  if (id === null) return { success: false, message: 'Distrito inválido.' }

  const name = formString(formData, 'name')
  if (!name) return { success: false, message: 'Ingresa un nombre válido.' }

  const province = formString(formData, 'province')
  const department = formString(formData, 'department')
  const latitude = formNumber(formData, 'latitude')
  const longitude = formNumber(formData, 'longitude')

  const client = await getAuthenticatedClient()
  const { error } = await client.database
    .from('districts')
    .update({
      name,
      province: province || null,
      department: department || null,
      latitude,
      longitude,
    })
    .eq('id', id)

  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9/distritos')
  return { success: true }
}

export async function deleteDistrict(districtId: number) {
  const client = await getAuthenticatedClient()
  const { error } = await client.database
    .from('districts')
    .delete()
    .eq('id', districtId)

  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9/distritos')
  return { success: true }
}

export async function toggleDistrict(districtId: number, active: boolean) {
  const client = await getAuthenticatedClient()
  const { error } = await client.database
    .from('districts')
    .update({ is_active: active })
    .eq('id', districtId)

  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9/distritos')
  return { success: true }
}

// ─── Ajuste manual de créditos ────────────────────────────────

export async function adjustCredits(formData: FormData) {
  const technicianId = formString(formData, 'technicianId')
  const amount = formNumber(formData, 'amount')
  const reason = formString(formData, 'reason')

  if (!technicianId) return { success: false, message: 'Técnico inválido.' }
  if (amount === null || amount === 0) return { success: false, message: 'Ingresa un monto distinto de cero.' }
  if (!reason) return { success: false, message: 'Ingresa un motivo para el ajuste.' }

  const admin = await getAdminSession()
  if (!admin) return { success: false, message: 'Sesión admin inválida.' }

  const client = await getAuthenticatedClient()

  // Get current wallet
  const { data: wallet, error: walletError } = await client.database
    .from('credit_wallets')
    .select('id, balance')
    .eq('technician_id', technicianId)
    .single()

  if (walletError || !wallet) return { success: false, message: 'No se encontró la billetera del técnico.' }

  const newBalance = wallet.balance + amount
  if (newBalance < 0) return { success: false, message: 'El saldo resultante no puede ser negativo.' }

  // Update balance
  const { error: updateError } = await client.database
    .from('credit_wallets')
    .update({ balance: newBalance })
    .eq('technician_id', technicianId)

  if (updateError) return { success: false, message: updateError.message }

  // Insert audit transaction
  await client.database.from('credit_transactions').insert([
    {
      wallet_id: wallet.id,
      type: amount > 0 ? 'admin_credit' : 'admin_debit',
      amount: Math.abs(amount),
      balance_after: newBalance,
      description: `[Admin] ${reason}`,
    },
  ])

  revalidatePath(`/gestion-x7k2m9/usuarios/${technicianId}`)
  revalidatePath('/gestion-x7k2m9')
  return { success: true, message: `Créditos ajustados correctamente. Nuevo saldo: ${newBalance}` }
}

// ─── Asignación manual de técnico ─────────────────────────────

export async function assignTechnicianToRequest(requestId: string, technicianId: string) {
  if (!requestId) return { success: false, message: 'Pedido inválido.' }
  if (!technicianId) return { success: false, message: 'Técnico inválido.' }

  const client = await getAuthenticatedClient()
  const { error } = await client.database
    .from('service_requests')
    .update({ assigned_technician_id: technicianId, status: 'assigned' })
    .eq('id', requestId)

  if (error) return { success: false, message: error.message }

  // Also update the application status
  await client.database
    .from('request_applications')
    .update({ status: 'accepted' })
    .eq('request_id', requestId)
    .eq('technician_id', technicianId)

  revalidatePath(`/gestion-x7k2m9/reservas/${requestId}`)
  revalidatePath('/gestion-x7k2m9/reservas')
  revalidatePath('/gestion-x7k2m9')
  return { success: true }
}

// ─── Admin Users Management ──────────────────────────────────

export async function promoteToAdmin(userId: string, level: 'superadmin' | 'admin' | 'moderator') {
  if (!userId) return { success: false, message: 'Usuario inválido.' }

  const admin = await getAdminSession()
  if (!admin || admin.adminLevel !== 'superadmin') {
    return { success: false, message: 'Solo superadmins pueden gestionar administradores.' }
  }

  const client = await getAuthenticatedClient()
  const { error } = await client.database
    .from('profiles')
    .update({ role: 'admin', admin_level: level })
    .eq('id', userId)

  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9/configuracion')
  return { success: true }
}

export async function setAdminLevel(userId: string, level: 'superadmin' | 'admin' | 'moderator') {
  if (!userId) return { success: false, message: 'Usuario inválido.' }

  const admin = await getAdminSession()
  if (!admin || admin.adminLevel !== 'superadmin') {
    return { success: false, message: 'Solo superadmins pueden cambiar niveles.' }
  }

  if (userId === admin.id) {
    return { success: false, message: 'No puedes cambiar tu propio nivel.' }
  }

  const client = await getAuthenticatedClient()
  const { error } = await client.database
    .from('profiles')
    .update({ admin_level: level })
    .eq('id', userId)

  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9/configuracion')
  return { success: true }
}

export async function removeAdminAccess(userId: string) {
  if (!userId) return { success: false, message: 'Usuario inválido.' }

  const admin = await getAdminSession()
  if (!admin || admin.adminLevel !== 'superadmin') {
    return { success: false, message: 'Solo superadmins pueden revocar acceso.' }
  }

  if (userId === admin.id) {
    return { success: false, message: 'No puedes revocarte a ti mismo.' }
  }

  const client = await getAuthenticatedClient()
  const { error } = await client.database
    .from('profiles')
    .update({ role: 'client', admin_level: null })
    .eq('id', userId)

  if (error) return { success: false, message: error.message }
  revalidatePath('/gestion-x7k2m9/configuracion')
  return { success: true }
}
