'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { assignTechnicianToRequest } from '@/lib/admin-data/actions'

export function AssignButton({
  requestId,
  technicianId,
  technicianName,
}: {
  requestId: string
  technicianId: string
  technicianName: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleAssign() {
    if (!confirm(`¿Asignar a ${technicianName} a este pedido?`)) return
    startTransition(async () => {
      const result = await assignTechnicianToRequest(requestId, technicianId)
      if (result.success) {
        router.refresh()
      } else {
        alert(result.message ?? 'Error al asignar técnico.')
      }
    })
  }

  return (
    <button
      onClick={handleAssign}
      disabled={isPending}
      className="rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-ink/90 disabled:opacity-50"
    >
      {isPending ? 'Asignando...' : 'Asignar'}
    </button>
  )
}
