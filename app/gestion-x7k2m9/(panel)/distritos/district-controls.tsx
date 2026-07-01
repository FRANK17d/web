'use client'

import { type FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  createDistrict,
  updateDistrict,
  toggleDistrict,
  deleteDistrict,
} from '@/lib/admin-data/actions'
import type { DistrictRow } from '@/lib/admin-data/queries'

type ActionResult = {
  success?: boolean
  message?: string
}

export function DistrictCreateForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const result = (await createDistrict(formData)) as ActionResult
      if (result.success) {
        form.reset()
        setMessage(null)
        router.refresh()
        return
      }
      setMessage(result.message ?? 'No se pudo crear el distrito.')
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-hero border border-slate/10 bg-white p-5 shadow-card"
    >
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <label className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-eyebrow text-slate">
            Nuevo distrito
          </span>
          <input
            className="h-11 w-full rounded-xl border border-slate/15 px-3 text-sm outline-none focus:border-[#EE7070]"
            name="name"
            placeholder="Ej. Trujillo"
            required
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-eyebrow text-slate">Provincia</span>
          <input
            className="h-11 w-full rounded-xl border border-slate/15 px-3 text-sm outline-none focus:border-[#EE7070]"
            name="province"
            placeholder="Ej. Trujillo"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-eyebrow text-slate">
            Departamento
          </span>
          <input
            className="h-11 w-full rounded-xl border border-slate/15 px-3 text-sm outline-none focus:border-[#EE7070]"
            name="department"
            placeholder="Ej. La Libertad"
          />
        </label>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        <label className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-eyebrow text-slate">Latitud</span>
          <input
            className="h-11 w-full rounded-xl border border-slate/15 px-3 text-sm outline-none focus:border-[#EE7070]"
            name="latitude"
            type="number"
            step="any"
            placeholder="-8.1118"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-eyebrow text-slate">Longitud</span>
          <input
            className="h-11 w-full rounded-xl border border-slate/15 px-3 text-sm outline-none focus:border-[#EE7070]"
            name="longitude"
            type="number"
            step="any"
            placeholder="-79.0283"
          />
        </label>
        <div className="flex items-end">
          <button
            className="h-11 rounded-xl bg-[#EE7070] px-5 text-sm font-bold text-white transition hover:bg-[#d95f5f] disabled:opacity-50"
            disabled={isPending}
            type="submit"
          >
            {isPending ? 'Guardando...' : 'Agregar'}
          </button>
        </div>
      </div>

      {message && (
        <p className="mt-3 text-xs font-semibold text-red-600">{message}</p>
      )}
    </form>
  )
}

export function DistrictActions({ district }: { district: DistrictRow }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  function refreshAfter(result: ActionResult) {
    if (result.success) {
      setMessage(null)
      setIsEditing(false)
      setShowDeleteConfirm(false)
      router.refresh()
      return
    }
    setMessage(result.message ?? 'No se pudo guardar el cambio.')
  }

  function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      refreshAfter((await updateDistrict(formData)) as ActionResult)
    })
  }

  function handleToggle() {
    startTransition(async () => {
      refreshAfter(
        (await toggleDistrict(district.id, !district.is_active)) as ActionResult,
      )
    })
  }

  function handleDelete() {
    startTransition(async () => {
      refreshAfter((await deleteDistrict(district.id)) as ActionResult)
    })
  }

  if (isEditing) {
    return (
      <form onSubmit={handleUpdate} className="space-y-2">
        <input name="id" type="hidden" value={district.id} />
        <div className="flex flex-wrap gap-2">
          <input
            className="h-9 w-28 rounded-lg border border-neutral-200 px-2 text-xs outline-none focus:border-[#EE7070]"
            defaultValue={district.name}
            name="name"
            placeholder="Nombre"
            required
          />
          <input
            className="h-9 w-24 rounded-lg border border-neutral-200 px-2 text-xs outline-none focus:border-[#EE7070]"
            defaultValue={district.province ?? ''}
            name="province"
            placeholder="Provincia"
          />
          <input
            className="h-9 w-24 rounded-lg border border-neutral-200 px-2 text-xs outline-none focus:border-[#EE7070]"
            defaultValue={district.department ?? ''}
            name="department"
            placeholder="Depto."
          />
          <input
            className="h-9 w-24 rounded-lg border border-neutral-200 px-2 text-xs outline-none focus:border-[#EE7070]"
            defaultValue={district.latitude ?? ''}
            name="latitude"
            type="number"
            step="any"
            placeholder="Lat"
          />
          <input
            className="h-9 w-24 rounded-lg border border-neutral-200 px-2 text-xs outline-none focus:border-[#EE7070]"
            defaultValue={district.longitude ?? ''}
            name="longitude"
            type="number"
            step="any"
            placeholder="Lng"
          />
          <button
            className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600 disabled:opacity-50"
            disabled={isPending}
            type="submit"
          >
            Guardar
          </button>
          <button
            className="text-xs font-semibold text-neutral-400 hover:text-neutral-700"
            disabled={isPending}
            onClick={() => {
              setIsEditing(false)
              setMessage(null)
            }}
            type="button"
          >
            Cancelar
          </button>
        </div>
        {message && <p className="text-xs font-semibold text-red-600">{message}</p>}
      </form>
    )
  }

  if (showDeleteConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-neutral-500">Eliminar {district.name}?</span>
        <button
          className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50"
          disabled={isPending}
          onClick={handleDelete}
        >
          {isPending ? '...' : 'Confirmar'}
        </button>
        <button
          className="text-xs font-semibold text-neutral-400 hover:text-neutral-700"
          disabled={isPending}
          onClick={() => setShowDeleteConfirm(false)}
          type="button"
        >
          Cancelar
        </button>
        {message && <span className="text-xs font-semibold text-red-600">{message}</span>}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
        disabled={isPending}
        onClick={() => setIsEditing(true)}
      >
        Editar
      </button>
      <button
        className={`rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${
          district.is_active
            ? 'border border-red-200 text-red-500 hover:bg-red-50'
            : 'bg-green-500 text-white hover:bg-green-600'
        }`}
        disabled={isPending}
        onClick={handleToggle}
      >
        {isPending ? '...' : district.is_active ? 'Desactivar' : 'Activar'}
      </button>
      <button
        className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-400 hover:border-red-200 hover:text-red-500 disabled:opacity-50"
        disabled={isPending}
        onClick={() => setShowDeleteConfirm(true)}
      >
        Eliminar
      </button>
      {message && <span className="text-xs font-semibold text-red-600">{message}</span>}
    </div>
  )
}
