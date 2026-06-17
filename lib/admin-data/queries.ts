import 'server-only'

import { cache } from 'react'
import { cookies } from 'next/headers'
import { createInsforgeServerClient } from '@/lib/admin-auth/insforge'
import { ADMIN_COOKIE_NAMES } from '@/lib/admin-auth/config'

function getAdminClient() {
  return createInsforgeServerClient()
}

type Relation<T> = T | T[] | null

function firstRelation<T>(value: Relation<T>) {
  return Array.isArray(value) ? value[0] ?? null : value
}

async function getAuthenticatedClient() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ADMIN_COOKIE_NAMES.access)?.value ?? null
  return createInsforgeServerClient(accessToken)
}

// ─── Dashboard KPIs ───────────────────────────────────────────

export const getDashboardStats = cache(async () => {
  const client = getAdminClient()

  const [users, requests, verifications, disputes, activeServices] = await Promise.all([
    client.database.from('profiles').select('*', { count: 'exact', head: true }),
    client.database.from('service_requests').select('*', { count: 'exact', head: true }),
    client.database
      .from('technician_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('verification_status', 'pending'),
    client.database
      .from('service_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending_review'),
    client.database
      .from('service_categories')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true),
  ])

  return {
    totalUsers: users.count ?? 0,
    totalRequests: requests.count ?? 0,
    pendingVerifications: verifications.count ?? 0,
    pendingModeration: disputes.count ?? 0,
    activeServices: activeServices.count ?? 0,
  }
})

// ─── Users ────────────────────────────────────────────────────

export type UserRow = {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  role: string
  is_active: boolean
  created_at: string
}

export async function getUsers(filters?: { role?: string; search?: string }) {
  let query = getAdminClient()
    .database.from('profiles')
    .select('id, first_name, last_name, email, phone, role, is_active, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  if (filters?.role && filters.role !== 'all') {
    query = query.eq('role', filters.role)
  }
  if (filters?.search) {
    query = query.or(
      `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
    )
  }

  const { data, error } = await query
  if (error) return []
  return (data ?? []) as UserRow[]
}

// ─── Service Categories ───────────────────────────────────────

export type ServiceCategoryRow = {
  id: number
  name: string
  emoji: string | null
  slug: string
  is_active: boolean
  created_at: string
}

export async function getServiceCategories() {
  const client = await getAuthenticatedClient()
  const { data, error } = await client.database
    .from('service_categories')
    .select('id, name, emoji, slug, is_active, created_at')
    .order('name', { ascending: true })

  if (error) return []
  return (data ?? []) as ServiceCategoryRow[]
}

// ─── Credit Packages ──────────────────────────────────────────

export type CreditPackageRow = {
  id: number
  name: string
  credits: number
  price_pen: number
  is_active: boolean
  sort_order: number
  created_at: string
}

export async function getCreditPackages() {
  const client = await getAuthenticatedClient()
  const { data, error } = await client.database
    .from('credit_packages')
    .select('id, name, credits, price_pen, is_active, sort_order, created_at')
    .order('sort_order', { ascending: true })
    .order('credits', { ascending: true })

  if (error) return []
  return (data ?? []) as CreditPackageRow[]
}

// ─── Subscription Plans / TokePro ─────────────────────────────

export type SubscriptionPlanRow = {
  id: number
  name: string
  duration_days: number
  price_pen: number
  included_credits: number
  benefits: Record<string, unknown>
  is_active: boolean
  sort_order: number
  created_at: string
}

export async function getSubscriptionPlans() {
  const client = await getAuthenticatedClient()
  const { data, error } = await client.database
    .from('subscription_plans')
    .select('id, name, duration_days, price_pen, included_credits, benefits, is_active, sort_order, created_at')
    .order('sort_order', { ascending: true })
    .order('duration_days', { ascending: true })

  if (error) return []
  return (data ?? []) as SubscriptionPlanRow[]
}

// ─── Service Requests (Pedidos) ───────────────────────────────

export type ServiceRequestRow = {
  id: string
  title: string
  description: string | null
  status: string
  category_id: string
  district_id: string
  created_at: string
  client_id: string
  category_name?: string
  category_emoji?: string
  district_name?: string
  client_name?: string
}

type ServiceRequestQueryRow = {
  id: string
  title: string
  description: string | null
  status: string
  category_id: string
  district_id: string
  created_at: string
  client_id: string
  service_categories: Relation<{ name: string | null; emoji: string | null }>
  districts: Relation<{ name: string | null }>
  profiles: Relation<{ first_name: string | null; last_name: string | null }>
}

type AdminRpcResult = {
  success?: boolean
  message?: string
  [key: string]: unknown
}

export async function getServiceRequests(filters?: { status?: string }) {
  const client = getAdminClient()

  let query = client.database
    .from('service_requests')
    .select(
      'id, title, description, status, category_id, district_id, created_at, client_id, service_categories(name, emoji), districts(name), profiles!service_requests_client_id_fkey(first_name, last_name)'
    )
    .order('created_at', { ascending: false })
    .limit(100)

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query
  if (error) return []

  return ((data ?? []) as ServiceRequestQueryRow[]).map((r) => {
    const category = firstRelation(r.service_categories)
    const district = firstRelation(r.districts)
    const profile = firstRelation(r.profiles)

    return {
      id: r.id,
      title: r.title,
      description: r.description,
      status: r.status,
      category_id: r.category_id,
      district_id: r.district_id,
      created_at: r.created_at,
      client_id: r.client_id,
      category_name: category?.name ?? '',
      category_emoji: category?.emoji ?? '',
      district_name: district?.name ?? '',
      client_name: [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Sin nombre',
    }
  }) as ServiceRequestRow[]
}

export async function reviewServiceRequest(requestId: string, approve: boolean, reason?: string) {
  const client = await getAuthenticatedClient()
  const { data, error } = await client.database.rpc('review_service_request', {
    p_request_id: requestId,
    p_approve: approve,
    p_reason: reason ?? null,
  })
  if (error) return { success: false, message: error.message }
  return (data as AdminRpcResult | null) ?? { success: true }
}

// ─── Technician Verifications ─────────────────────────────────

export type TechnicianVerificationRow = {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  verification_status: string
  dni_number: string | null
  specialty: string | null
  created_at: string
  district_name?: string
  documents: VerificationDocumentRow[]
}

export type VerificationDocumentRow = {
  doc_type: string
  file_path: string
  status: string
  review_notes: string | null
  created_at: string
  reviewed_at: string | null
  url: string
}

type TechnicianVerificationQueryRow = {
  id: string
  verification_status: string
  dni: string | null
  bio: string | null
  created_at: string
  profiles: Relation<{ first_name: string | null; last_name: string | null; email: string | null; phone: string | null }>
  districts: Relation<{ name: string | null }>
}

type VerificationDocumentQueryRow = {
  technician_id: string
  doc_type: string
  file_path: string
  status: string
  review_notes: string | null
  created_at: string
  reviewed_at: string | null
}

function verificationDocumentUrl(filePath: string) {
  return `/gestion-x7k2m9/verificaciones/documento?path=${encodeURIComponent(filePath)}`
}

export async function getTechnicianVerifications(filters?: { status?: string }) {
  const client = await getAuthenticatedClient()

  let query = client.database
    .from('technician_profiles')
    .select(
      'id, verification_status, dni, bio, created_at, profiles(first_name, last_name, email, phone), districts(name)'
    )
    .order('created_at', { ascending: false })
    .limit(100)

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('verification_status', filters.status)
  }

  const { data, error } = await query
  if (error) return []

  const rows = (data ?? []) as TechnicianVerificationQueryRow[]
  const technicianIds = rows.map((r) => r.id)
  const documentsByTechnician = new Map<string, VerificationDocumentRow[]>()

  if (technicianIds.length > 0) {
    const { data: documents } = await client.database
      .from('verification_documents')
      .select('technician_id, doc_type, file_path, status, review_notes, created_at, reviewed_at')
      .in('technician_id', technicianIds)
      .order('created_at', { ascending: false })

    const seen = new Set<string>()
    for (const doc of (documents ?? []) as VerificationDocumentQueryRow[]) {
      const key = `${doc.technician_id}:${doc.doc_type}`
      if (seen.has(key)) continue
      seen.add(key)

      const list = documentsByTechnician.get(doc.technician_id) ?? []
      list.push({
        doc_type: doc.doc_type,
        file_path: doc.file_path,
        status: doc.status,
        review_notes: doc.review_notes,
        created_at: doc.created_at,
        reviewed_at: doc.reviewed_at,
        url: verificationDocumentUrl(doc.file_path),
      })
      documentsByTechnician.set(doc.technician_id, list)
    }
  }

  return rows.map((r) => {
    const profile = firstRelation(r.profiles)
    const district = firstRelation(r.districts)

    return {
      id: r.id,
      user_id: r.id,
      first_name: profile?.first_name ?? '',
      last_name: profile?.last_name ?? '',
      email: profile?.email ?? null,
      phone: profile?.phone ?? null,
      verification_status: r.verification_status,
      dni_number: r.dni,
      specialty: r.bio,
      created_at: r.created_at,
      district_name: district?.name ?? '',
      documents: documentsByTechnician.get(r.id) ?? [],
    }
  }) as TechnicianVerificationRow[]
}

export async function updateVerificationStatus(
  techProfileId: string,
  status: 'verified' | 'rejected',
  reason?: string
) {
  const client = getAdminClient()
  const update: Record<string, unknown> = { verification_status: status }
  if (reason) update.rejection_reason = reason
  if (status === 'verified') update.verified_at = new Date().toISOString()

  const { error } = await client.database
    .from('technician_profiles')
    .update(update)
    .eq('id', techProfileId)

  if (error) return { success: false, message: error.message }
  return { success: true }
}

// ─── Credit Wallets ───────────────────────────────────────────

export async function getCreditStats() {
  const client = await getAuthenticatedClient()
  const { data } = await client.database
    .from('credit_wallets')
    .select('balance')

  if (!data) return { totalCredits: 0, wallets: 0 }
  const arr = data as { balance: number }[]
  return {
    totalCredits: arr.reduce((sum, w) => sum + (w.balance ?? 0), 0),
    wallets: arr.length,
  }
}
