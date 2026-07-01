'use client'

import { type FormEvent, useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { updateIntegrationSettings, uploadBrandingImage } from '@/lib/admin-data/actions'

type ActionResult = { success?: boolean; message?: string; url?: string }

export function IntegrationSettingsForm({
  settings,
}: {
  settings: {
    mercadopagoSandbox: boolean
    commissionRate: number
    maxPhotosPerRequest: number
    autoApproveRequests: boolean
  }
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = (await updateIntegrationSettings(formData)) as ActionResult
      if (result.success) {
        setSaved(true)
        setMessage(null)
        router.refresh()
        setTimeout(() => setSaved(false), 2000)
      } else {
        setMessage(result.message ?? 'Error al guardar.')
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-hero border border-slate/10 bg-white p-6 shadow-card"
    >
      <p className="text-xs font-bold uppercase tracking-eyebrow text-neutral-400">
        Integraciones
      </p>
      <h3 className="mt-1 mb-5 text-base font-bold text-neutral-800">
        Variables operativas
      </h3>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="flex items-center gap-3">
          <input
            type="hidden"
            name="mercadopagoSandbox"
            value="false"
          />
          <input
            type="checkbox"
            name="mercadopagoSandbox"
            value="true"
            defaultChecked={settings.mercadopagoSandbox}
            className="h-4 w-4 rounded border-neutral-300 text-[#EE7070] focus:ring-[#EE7070]"
          />
          <div>
            <span className="text-sm font-medium text-neutral-800">MercadoPago Sandbox</span>
            <p className="text-xs text-neutral-400">Modo prueba (no cobra de verdad)</p>
          </div>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="hidden"
            name="autoApproveRequests"
            value="false"
          />
          <input
            type="checkbox"
            name="autoApproveRequests"
            value="true"
            defaultChecked={settings.autoApproveRequests}
            className="h-4 w-4 rounded border-neutral-300 text-[#EE7070] focus:ring-[#EE7070]"
          />
          <div>
            <span className="text-sm font-medium text-neutral-800">Auto-aprobar pedidos</span>
            <p className="text-xs text-neutral-400">Publicar sin revision manual</p>
          </div>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-neutral-800">Comision (%)</span>
          <input
            className="h-10 w-full rounded-xl border border-slate/15 px-3 text-sm outline-none focus:border-[#EE7070]"
            name="commissionRate"
            type="number"
            step="0.1"
            min="0"
            max="100"
            defaultValue={settings.commissionRate}
          />
          <p className="text-xs text-neutral-400">0 = sin comision (modelo actual)</p>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-neutral-800">Max fotos por pedido</span>
          <input
            className="h-10 w-full rounded-xl border border-slate/15 px-3 text-sm outline-none focus:border-[#EE7070]"
            name="maxPhotosPerRequest"
            type="number"
            min="1"
            max="20"
            defaultValue={settings.maxPhotosPerRequest}
          />
        </label>
      </div>

      <div className="mt-5 flex items-center gap-3 border-t border-slate/10 pt-4">
        <button
          className="rounded-xl bg-[#EE7070] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#d95f5f] disabled:opacity-50"
          disabled={isPending}
          type="submit"
        >
          {isPending ? 'Guardando...' : 'Guardar variables'}
        </button>
        {saved && <span className="text-xs font-semibold text-green-600">Guardado</span>}
        {message && <span className="text-xs font-semibold text-red-600">{message}</span>}
      </div>
    </form>
  )
}

export function ImageUploadCard({
  imageType,
  label,
  currentUrl,
}: {
  imageType: 'logo' | 'hero'
  label: string
  currentUrl: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleUpload() {
    const file = fileRef.current?.files?.[0]
    if (!file) return

    setPreviewUrl(URL.createObjectURL(file))
    const formData = new FormData()
    formData.append('file', file)
    formData.append('imageType', imageType)

    startTransition(async () => {
      const result = (await uploadBrandingImage(formData)) as ActionResult
      if (result.success) {
        setMessage(null)
        router.refresh()
      } else {
        setMessage(result.message ?? 'Error al subir.')
        setPreviewUrl(null)
      }
    })
  }

  const displayUrl = previewUrl || currentUrl

  return (
    <div className="rounded-hero border border-slate/10 bg-white p-5 shadow-card">
      <p className="mb-3 text-sm font-semibold text-neutral-800">{label}</p>
      {displayUrl && (
        <div className="mb-3 overflow-hidden rounded-xl border border-slate/10 bg-neutral-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayUrl}
            alt={label}
            className="mx-auto max-h-32 object-contain"
          />
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-neutral-600 hover:file:bg-neutral-200"
        />
        {isPending && <span className="text-xs text-neutral-400">Subiendo...</span>}
      </div>
      {message && <p className="mt-2 text-xs text-red-600">{message}</p>}
      {currentUrl && (
        <p className="mt-2 truncate text-xs text-neutral-400" title={currentUrl}>
          {currentUrl}
        </p>
      )}
    </div>
  )
}
