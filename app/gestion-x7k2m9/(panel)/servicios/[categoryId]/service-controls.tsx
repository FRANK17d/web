'use client'

import { type FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  createService,
  deleteService,
  toggleService,
  updateService,
} from '@/lib/admin-data/actions'
import type { ServiceItemRow } from '@/lib/admin-data/queries'

type ActionResult = {
  success?: boolean
  message?: string
}

export function ServiceCreateForm({ categoryId }: { categoryId: number }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const result = (await createService(formData)) as ActionResult
      if (result.success) {
        form.reset()
        setMessage(null)
        router.refresh()
        return
      }
      setMessage(result.message ?? 'No se pudo crear el servicio.')
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 grid gap-3 rounded-hero border border-slate/10 bg-white p-5 shadow-card md:grid-cols-[minmax(0,1fr)_auto]"
    >
      <input name="category_id" type="hidden" value={categoryId} />
      <label className="space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-eyebrow text-slate">Nuevo servicio</span>
        <input
          className="h-11 w-full rounded-xl border border-slate/15 px-3 text-sm outline-none focus:border-[#EE7070]"
          name="name"
          placeholder="Ej. Instalación de tomacorrientes"
          required
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
      {message && <p className="text-xs font-semibold text-red-600 md:col-span-2">{message}</p>}
    </form>
  )
}

export function ServiceActions({ service }: { service: ServiceItemRow }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isEditing, setIsEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  function refreshAfter(result: ActionResult) {
    if (result.success) {
      setMessage(null)
      setIsEditing(false)
      setConfirmDelete(false)
      router.refresh()
      return
    }
    setMessage(result.message ?? 'No se pudo guardar el cambio.')
  }

  function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      refreshAfter((await updateService(formData)) as ActionResult)
    })
  }

  function handleToggle() {
    startTransition(async () => {
      refreshAfter(
        (await toggleService(service.id, !service.is_active, service.category_id)) as ActionResult,
      )
    })
  }

  function handleDelete() {
    startTransition(async () => {
      refreshAfter((await deleteService(service.id, service.category_id)) as ActionResult)
    })
  }

  if (isEditing) {
    return (
      <form onSubmit={handleUpdate} className="min-w-72 space-y-2">
        <input name="id" type="hidden" value={service.id} />
        <input name="category_id" type="hidden" value={service.category_id} />
        <div className="flex gap-2">
          <input
            className="h-9 w-56 rounded-lg border border-neutral-200 px-2 text-xs outline-none focus:border-[#EE7070]"
            defaultValue={service.name}
            name="name"
            required
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
          service.is_active
            ? 'border border-red-200 text-red-500 hover:bg-red-50'
            : 'bg-green-500 text-white hover:bg-green-600'
        }`}
        disabled={isPending}
        onClick={handleToggle}
      >
        {isPending ? '...' : service.is_active ? 'Desactivar' : 'Activar'}
      </button>
      {confirmDelete ? (
        <span className="flex items-center gap-1.5">
          <button
            className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50"
            disabled={isPending}
            onClick={handleDelete}
          >
            Confirmar
          </button>
          <button
            className="text-xs font-semibold text-neutral-400 hover:text-neutral-700"
            disabled={isPending}
            onClick={() => setConfirmDelete(false)}
          >
            No
          </button>
        </span>
      ) : (
        <button
          className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-500 hover:bg-neutral-50 disabled:opacity-50"
          disabled={isPending}
          onClick={() => setConfirmDelete(true)}
        >
          Eliminar
        </button>
      )}
      {message && <span className="text-xs font-semibold text-red-600">{message}</span>}
    </div>
  )
}
