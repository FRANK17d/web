'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleUserActive } from '@/lib/admin-data/actions'

export function UserToggle({ userId, isActive }: { userId: string; isActive: boolean }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      await toggleUserActive(userId, !isActive)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${
        isActive
          ? 'border border-red-200 text-red-500 hover:bg-red-50'
          : 'bg-green-500 text-white hover:bg-green-600'
      }`}
    >
      {isPending ? '...' : isActive ? 'Desactivar' : 'Activar'}
    </button>
  )
}
