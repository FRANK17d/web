'use client'

import { type FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  createServiceCategory,
  toggleServiceCategory,
  updateServiceCategory,
} from '@/lib/admin-data/actions'
import type { ServiceCategoryRow } from '@/lib/admin-data/queries'

type ActionResult = {
  success?: boolean
  message?: string
}

export function CategoryCreateForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const result = (await createServiceCategory(formData)) as ActionResult
      if (result.success) {
        form.reset()
        setMessage(null)
        router.refresh()
        return
      }
      setMessage(result.message ?? 'No se pudo crear la categoría.')
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 grid gap-3 rounded-hero border border-slate/10 bg-white p-5 shadow-card md:grid-cols-[minmax(0,1fr)_120px_auto]"
    >
      <label className="space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-eyebrow text-slate">Nueva categoría</span>
        <input
          className="h-11 w-full rounded-xl border border-slate/15 px-3 text-sm outline-none focus:border-[#EE7070]"
          name="name"
          placeholder="Ej. Carpintería"
          required
        />
      </label>
      <label className="space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-eyebrow text-slate">Emoji</span>
        <input
          className="h-11 w-full rounded-xl border border-slate/15 px-3 text-sm outline-none focus:border-[#EE7070]"
          maxLength={10}
          name="emoji"
          placeholder="🪚"
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
      {message && <p className="text-xs font-semibold text-red-600 md:col-span-3">{message}</p>}
    </form>
  )
}

export function CategoryActions({ category }: { category: ServiceCategoryRow }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  function refreshAfter(result: ActionResult) {
    if (result.success) {
      setMessage(null)
      setIsEditing(false)
      router.refresh()
      return
    }
    setMessage(result.message ?? 'No se pudo guardar el cambio.')
  }

  function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      refreshAfter((await updateServiceCategory(formData)) as ActionResult)
    })
  }

  function handleToggle() {
    startTransition(async () => {
      refreshAfter(
        (await toggleServiceCategory(category.id, !category.is_active)) as ActionResult,
      )
    })
  }

  if (isEditing) {
    return (
      <form onSubmit={handleUpdate} className="min-w-72 space-y-2">
        <input name="id" type="hidden" value={category.id} />
        <div className="flex gap-2">
          <input
            className="h-9 w-32 rounded-lg border border-neutral-200 px-2 text-xs outline-none focus:border-[#EE7070]"
            defaultValue={category.name}
            name="name"
            required
          />
          <input
            className="h-9 w-16 rounded-lg border border-neutral-200 px-2 text-xs outline-none focus:border-[#EE7070]"
            defaultValue={category.emoji ?? ''}
            maxLength={10}
            name="emoji"
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
          category.is_active
            ? 'border border-red-200 text-red-500 hover:bg-red-50'
            : 'bg-green-500 text-white hover:bg-green-600'
        }`}
        disabled={isPending}
        onClick={handleToggle}
      >
        {isPending ? '...' : category.is_active ? 'Desactivar' : 'Activar'}
      </button>
      {message && <span className="text-xs font-semibold text-red-600">{message}</span>}
    </div>
  )
}
