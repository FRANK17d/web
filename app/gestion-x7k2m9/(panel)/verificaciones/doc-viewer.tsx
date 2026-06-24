'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, ImageOff, X } from 'lucide-react'

export type ViewerDoc = { label: string; url: string; status: string }

const STATUS_LABEL: Record<string, string> = {
  pending: 'En revisión',
  verified: 'Verificado',
  rejected: 'Rechazado',
}
const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-warning-50 text-warning-700',
  verified: 'bg-success-50 text-success-700',
  rejected: 'bg-danger-50 text-danger-700',
}

/**
 * Galería de documentos de verificación. Las imágenes se ven INLINE en el panel
 * (servidas por el route /verificaciones/documento, mismo origen → permitido por
 * el CSP), con lightbox para ampliar. No se descargan.
 */
export function DocViewer({ docs }: { docs: ViewerDoc[] }) {
  const [active, setActive] = useState<number | null>(null)

  const close = useCallback(() => setActive(null), [])
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % docs.length)),
    [docs.length],
  )
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + docs.length) % docs.length)),
    [docs.length],
  )

  useEffect(() => {
    if (active === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [active, close, next, prev])

  if (!docs || docs.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-canvas px-4 py-5 text-sm text-slate">
        <ImageOff className="h-4 w-4" />
        El técnico aún no subió documentos.
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {docs.map((d, i) => (
          <button
            key={d.label}
            type="button"
            onClick={() => setActive(i)}
            className="group overflow-hidden rounded-2xl border border-slate/10 bg-canvas text-left transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-300"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-surface-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={d.url}
                alt={d.label}
                loading="lazy"
                className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
              />
            </div>
            <div className="flex items-center justify-between gap-2 px-3 py-2">
              <span className="truncate text-xs font-semibold text-ink">{d.label}</span>
              <span
                className={`shrink-0 rounded-pill px-2 py-0.5 text-[10px] font-bold ${STATUS_STYLE[d.status] ?? 'bg-surface-100 text-surface-600'}`}
              >
                {STATUS_LABEL[d.status] ?? d.status}
              </span>
            </div>
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 motion-safe:animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label={`Documento: ${docs[active].label}`}
          onClick={close}
        >
          <button
            onClick={close}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {docs.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              aria-label="Anterior"
              className="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={docs[active].url}
            alt={docs[active].label}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[82vh] max-w-[90vw] rounded-2xl object-contain shadow-card"
          />

          {docs.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              aria-label="Siguiente"
              className="absolute right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
            {docs[active].label} · {active + 1}/{docs.length}
          </span>
        </div>
      )}
    </>
  )
}
