'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, ImageOff, X } from 'lucide-react'

/**
 * Galería de las fotos del pedido para el panel admin. Grid de miniaturas con
 * lightbox (click para ampliar, flechas/Escape para navegar). Las fotos viven en
 * el bucket público `request-photos` (URLs absolutas *.insforge.app, permitidas
 * por el CSP), así que se usan <img> normales.
 */
export function RequestImageGallery({ urls }: { urls: string[] }) {
  const [active, setActive] = useState<number | null>(null)

  const close = useCallback(() => setActive(null), [])
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % urls.length)),
    [urls.length],
  )
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + urls.length) % urls.length)),
    [urls.length],
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

  if (!urls || urls.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-canvas px-4 py-5 text-sm text-slate">
        <ImageOff className="h-4 w-4" />
        El cliente no adjuntó fotos a este pedido.
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {urls.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Ver foto ${i + 1} de ${urls.length}`}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-slate/10 bg-canvas transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-300"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Foto ${i + 1} del pedido`}
              loading="lazy"
              className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
            />
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 motion-safe:animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Visor de fotos del pedido"
          onClick={close}
        >
          <button
            onClick={close}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {urls.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              aria-label="Foto anterior"
              className="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={urls[active]}
            alt={`Foto ${active + 1} del pedido`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-card"
          />

          {urls.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              aria-label="Foto siguiente"
              className="absolute right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {urls.length > 1 && (
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
              {active + 1} / {urls.length}
            </span>
          )}
        </div>
      )}
    </>
  )
}
