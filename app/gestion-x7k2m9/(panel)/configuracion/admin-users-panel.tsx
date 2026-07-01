'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  setAdminLevel,
  removeAdminAccess,
  promoteToAdmin,
} from '@/lib/admin-data/actions'
import type { AdminUserRow } from '@/lib/admin-data/queries'

type ActionResult = { success?: boolean; message?: string }
type AdminLevel = 'superadmin' | 'admin' | 'moderator'

const LEVEL_LABELS: Record<AdminLevel, string> = {
  superadmin: 'Superadmin',
  admin: 'Admin',
  moderator: 'Moderador',
}

const LEVEL_COLORS: Record<AdminLevel, string> = {
  superadmin: 'bg-purple-100 text-purple-700',
  admin: 'bg-blue-100 text-blue-700',
  moderator: 'bg-amber-100 text-amber-700',
}

export function AdminUsersPanel({
  admins,
  currentAdminId,
  isSuperadmin,
}: {
  admins: AdminUserRow[]
  currentAdminId: string
  isSuperadmin: boolean
}) {
  return (
    <div className="rounded-hero border border-slate/10 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-eyebrow text-neutral-400">
            Equipo
          </p>
          <h3 className="mt-1 text-base font-bold text-neutral-800">
            Administradores ({admins.length})
          </h3>
        </div>
        {isSuperadmin && <PromoteUserForm />}
      </div>

      <div className="divide-y divide-slate/5">
        {admins.map((admin) => (
          <AdminUserItem
            key={admin.id}
            admin={admin}
            currentAdminId={currentAdminId}
            isSuperadmin={isSuperadmin}
          />
        ))}
      </div>

      {!isSuperadmin && (
        <p className="mt-4 text-xs text-neutral-400">
          Solo superadmins pueden gestionar el equipo de administradores.
        </p>
      )}
    </div>
  )
}

function AdminUserItem({
  admin,
  currentAdminId,
  isSuperadmin,
}: {
  admin: AdminUserRow
  currentAdminId: string
  isSuperadmin: boolean
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const isMe = admin.id === currentAdminId
  const level = (admin.admin_level ?? 'superadmin') as AdminLevel

  function handleChangeLevel(newLevel: AdminLevel) {
    startTransition(async () => {
      const result = (await setAdminLevel(admin.id, newLevel)) as ActionResult
      if (result.success) {
        setMessage(null)
        router.refresh()
      } else {
        setMessage(result.message ?? 'Error')
      }
    })
  }

  function handleRemove() {
    if (!confirm(`Revocar acceso admin de ${admin.first_name ?? admin.email}?`)) return
    startTransition(async () => {
      const result = (await removeAdminAccess(admin.id)) as ActionResult
      if (result.success) {
        setMessage(null)
        router.refresh()
      } else {
        setMessage(result.message ?? 'Error')
      }
    })
  }

  const name =
    [admin.first_name, admin.last_name].filter(Boolean).join(' ') || admin.email || 'Admin'

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-500">
        {name.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-neutral-800">
          {name}
          {isMe && (
            <span className="ml-2 text-xs text-neutral-400">(tu)</span>
          )}
        </p>
        <p className="truncate text-xs text-neutral-400">{admin.email}</p>
      </div>
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${LEVEL_COLORS[level]}`}
      >
        {LEVEL_LABELS[level]}
      </span>
      {isSuperadmin && !isMe && (
        <div className="flex items-center gap-1.5">
          <select
            className="h-7 rounded-lg border border-neutral-200 px-2 text-xs outline-none focus:border-[#EE7070] disabled:opacity-50"
            defaultValue={level}
            disabled={isPending}
            onChange={(e) => handleChangeLevel(e.target.value as AdminLevel)}
          >
            <option value="superadmin">Superadmin</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderador</option>
          </select>
          <button
            className="rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
            disabled={isPending}
            onClick={handleRemove}
          >
            Revocar
          </button>
        </div>
      )}
      {message && <span className="text-xs text-red-600">{message}</span>}
    </div>
  )
}

function PromoteUserForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const userId = (formData.get('userId') as string)?.trim()
    const level = (formData.get('level') as AdminLevel) ?? 'admin'

    if (!userId) {
      setMessage('Ingresa el ID del usuario.')
      return
    }

    startTransition(async () => {
      const result = (await promoteToAdmin(userId, level)) as ActionResult
      if (result.success) {
        form.reset()
        setShowForm(false)
        setMessage(null)
        router.refresh()
      } else {
        setMessage(result.message ?? 'Error al promover usuario.')
      }
    })
  }

  if (!showForm) {
    return (
      <button
        className="rounded-lg bg-[#EE7070] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#d95f5f]"
        onClick={() => setShowForm(true)}
      >
        + Agregar admin
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
      <input
        className="h-8 w-56 rounded-lg border border-neutral-200 px-2 text-xs outline-none focus:border-[#EE7070]"
        name="userId"
        placeholder="UUID del usuario"
        required
      />
      <select
        className="h-8 rounded-lg border border-neutral-200 px-2 text-xs outline-none focus:border-[#EE7070]"
        name="level"
        defaultValue="admin"
      >
        <option value="superadmin">Superadmin</option>
        <option value="admin">Admin</option>
        <option value="moderator">Moderador</option>
      </select>
      <button
        className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-600 disabled:opacity-50"
        disabled={isPending}
        type="submit"
      >
        Promover
      </button>
      <button
        className="text-xs text-neutral-400 hover:text-neutral-700"
        onClick={() => {
          setShowForm(false)
          setMessage(null)
        }}
        type="button"
      >
        Cancelar
      </button>
      {message && <span className="text-xs text-red-600">{message}</span>}
    </form>
  )
}
