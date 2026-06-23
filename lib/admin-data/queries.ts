import 'server-only'

import { cache } from 'react'
import { cookies } from 'next/headers'
import { createInsforgeServerClient } from '@/lib/admin-auth/insforge'
import { ADMIN_COOKIE_NAMES } from '@/lib/admin-auth/config'

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
  const client = await getAuthenticatedClient()

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
  const client = await getAuthenticatedClient()
  let query = client.database
    .from('profiles')
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
  image_url?: string | null
}

export type ServiceRequestsPage = {
  rows: ServiceRequestRow[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export const PEDIDOS_PAGE_SIZE = 12

export type ServiceRequestDetailRow = ServiceRequestRow & {
  address: string | null
  image_urls: string[]
  budget_min: number | null
  budget_max: number | null
  preferred_date: string | null
  needs_invoice: boolean
  latitude: number | null
  longitude: number | null
  assigned_technician_id: string | null
  updated_at: string
}

export type RequestApplicationRow = {
  application_id: string
  technician_id: string
  message: string | null
  proposed_price: number | null
  status: string
  created_at: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  avg_rating: number | null
  total_jobs_completed: number | null
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

export async function getServiceRequests(filters?: {
  status?: string
  page?: number
  pageSize?: number
}): Promise<ServiceRequestsPage> {
  const client = await getAuthenticatedClient()

  const pageSize = filters?.pageSize ?? PEDIDOS_PAGE_SIZE
  const page = Math.max(1, filters?.page ?? 1)
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = client.database
    .from('service_requests')
    .select(
      'id, title, description, status, category_id, district_id, created_at, client_id, image_urls, service_categories(name, emoji), districts(name), profiles!service_requests_client_id_fkey(first_name, last_name)',
      { count: 'exact' },
    )
    .order('created_at', { ascending: false })
    .range(from, to)

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  const { data, error, count } = await query
  if (error) {
    return { rows: [], total: 0, page, pageSize, totalPages: 0 }
  }

  const rows = ((data ?? []) as (ServiceRequestQueryRow & {
    image_urls: string[] | null
  })[]).map((r) => {
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
      image_url: r.image_urls?.[0] ?? null,
    }
  }) as ServiceRequestRow[]

  const total = count ?? 0
  return { rows, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) }
}

export async function getServiceRequestDetail(requestId: string) {
  const client = await getAuthenticatedClient()
  const { data, error } = await client.database
    .from('service_requests')
    .select(
      'id, title, description, status, category_id, district_id, created_at, updated_at, client_id, address, image_urls, budget_min, budget_max, preferred_date, needs_invoice, latitude, longitude, assigned_technician_id, service_categories(name, emoji), districts(name), profiles!service_requests_client_id_fkey(first_name, last_name)'
    )
    .eq('id', requestId)
    .single()

  if (error || !data) return null

  const row = data as ServiceRequestQueryRow & {
    address: string | null
    image_urls: string[] | null
    budget_min: number | null
    budget_max: number | null
    preferred_date: string | null
    needs_invoice: boolean | null
    latitude: number | null
    longitude: number | null
    assigned_technician_id: string | null
    updated_at: string
  }
  const category = firstRelation(row.service_categories)
  const district = firstRelation(row.districts)
  const profile = firstRelation(row.profiles)

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    category_id: row.category_id,
    district_id: row.district_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    client_id: row.client_id,
    category_name: category?.name ?? '',
    category_emoji: category?.emoji ?? '',
    district_name: district?.name ?? '',
    client_name: [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Sin nombre',
    address: row.address,
    image_urls: row.image_urls ?? [],
    budget_min: row.budget_min,
    budget_max: row.budget_max,
    preferred_date: row.preferred_date,
    needs_invoice: row.needs_invoice ?? false,
    latitude: row.latitude,
    longitude: row.longitude,
    assigned_technician_id: row.assigned_technician_id,
  } as ServiceRequestDetailRow
}

export async function getRequestApplications(requestId: string) {
  const client = await getAuthenticatedClient()
  const { data, error } = await client.database.rpc('get_request_applications', {
    p_request_id: requestId,
  })

  if (error || !Array.isArray(data)) return []
  return data as RequestApplicationRow[]
}

// ─── Support Tickets ──────────────────────────────────────────

export type SupportTicketRow = {
  id: string
  user_id: string
  subject: string
  category: string | null
  status: string
  priority: string
  created_at: string
  updated_at: string
  user_name: string
  user_email: string | null
}

export type TicketMessageRow = {
  id: string
  ticket_id: string
  sender_id: string
  body: string
  is_admin: boolean
  created_at: string
  sender_name: string
  sender_email: string | null
}

type SupportTicketQueryRow = {
  id: string
  user_id: string
  subject: string
  category: string | null
  status: string
  priority: string
  created_at: string
  updated_at: string
}

type ProfileLookupRow = {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
}

export async function getSupportTickets(filters?: { status?: string }) {
  const client = await getAuthenticatedClient()
  let query = client.database
    .from('support_tickets')
    .select('id, user_id, subject, category, status, priority, created_at, updated_at')
    .order('updated_at', { ascending: false })
    .limit(100)

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query
  if (error) return []

  const rows = (data ?? []) as SupportTicketQueryRow[]
  const userIds = Array.from(new Set(rows.map((row) => row.user_id).filter(Boolean)))
  const profilesById = new Map<string, ProfileLookupRow>()

  if (userIds.length > 0) {
    const { data: profiles } = await client.database
      .from('profiles')
      .select('id, first_name, last_name, email')
      .in('id', userIds)

    for (const profile of (profiles ?? []) as ProfileLookupRow[]) {
      profilesById.set(profile.id, profile)
    }
  }

  return rows.map((row) => {
    const profile = profilesById.get(row.user_id)
    return {
      ...row,
      user_name: [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Usuario',
      user_email: profile?.email ?? null,
    }
  }) as SupportTicketRow[]
}

export async function getSupportTicketDetail(ticketId: string) {
  const client = await getAuthenticatedClient()
  const { data, error } = await client.database
    .from('support_tickets')
    .select('id, user_id, subject, category, status, priority, created_at, updated_at')
    .eq('id', ticketId)
    .single()

  if (error || !data) return null

  const row = data as SupportTicketQueryRow
  const { data: profileData } = await client.database
    .from('profiles')
    .select('id, first_name, last_name, email')
    .eq('id', row.user_id)
    .maybeSingle()

  const profile = profileData as ProfileLookupRow | null
  return {
    ...row,
    user_name: [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Usuario',
    user_email: profile?.email ?? null,
  } as SupportTicketRow
}

export async function getSupportTicketMessages(ticketId: string) {
  const client = await getAuthenticatedClient()
  const { data, error } = await client.database
    .from('ticket_messages')
    .select('id, ticket_id, sender_id, body, is_admin, created_at')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true })

  if (error) return []

  const rows = (data ?? []) as Omit<TicketMessageRow, 'sender_name' | 'sender_email'>[]
  const senderIds = Array.from(new Set(rows.map((row) => row.sender_id).filter(Boolean)))
  const profilesById = new Map<string, ProfileLookupRow>()

  if (senderIds.length > 0) {
    const { data: profiles } = await client.database
      .from('profiles')
      .select('id, first_name, last_name, email')
      .in('id', senderIds)

    for (const profile of (profiles ?? []) as ProfileLookupRow[]) {
      profilesById.set(profile.id, profile)
    }
  }

  return rows.map((row) => {
    const profile = profilesById.get(row.sender_id)
    return {
      ...row,
      sender_name: row.is_admin
        ? 'Soporte TOKE+'
        : [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Usuario',
      sender_email: profile?.email ?? null,
    }
  }) as TicketMessageRow[]
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
  const client = await getAuthenticatedClient()
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
