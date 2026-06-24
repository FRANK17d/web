'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleReviewVisibility } from '@/lib/admin-data/actions'
import { Eye, EyeOff } from 'lucide-react'

export function ReviewToggle({ reviewId, isVisible }: { reviewId: string; isVisible: boolean }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      await toggleReviewVisibility(reviewId, !isVisible)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      title={isVisible ? 'Ocultar reseña' : 'Mostrar reseña'}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
        isVisible
          ? 'border border-red-200 text-red-500 hover:bg-red-50'
          : 'border border-green-200 text-green-600 hover:bg-green-50'
      }`}
    >
      {isPending ? (
        '...'
      ) : isVisible ? (
        <>
          <EyeOff className="h-3.5 w-3.5" />
          Ocultar
        </>
      ) : (
        <>
          <Eye className="h-3.5 w-3.5" />
          Mostrar
        </>
      )}
    </button>
  )
}
