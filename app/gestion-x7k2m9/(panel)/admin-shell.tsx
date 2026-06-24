'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu } from 'lucide-react'
import { AdminSidebar } from '@/components/admin/sidebar'
import { SessionKeepAlive } from './session-keep-alive'

/**
 * Shell del panel admin. En escritorio: sidebar fijo + contenido con `md:ml-64`
 * (idéntico al diseño previo). En móvil/tablet chico: el sidebar pasa a ser un
 * drawer off-canvas con backdrop, controlado por un top bar con hamburguesa.
 */
export function AdminShell({
  userName,
  children,
}: {
  userName: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-50/50">
      <SessionKeepAlive />
      <AdminSidebar userName={userName} open={open} onClose={() => setOpen(false)} />

      {/* Backdrop solo en móvil cuando el drawer está abierto */}
      {open && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[1px] md:hidden"
        />
      )}

      <div className="flex min-h-screen flex-col md:ml-64">
        {/* Top bar móvil */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-neutral-100 bg-white/90 px-4 backdrop-blur md:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            className="-ml-1 rounded-lg p-1.5 text-neutral-600 transition-colors hover:bg-neutral-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Image
            src="/toke-logo.svg"
            alt="toke+"
            width={72}
            height={28}
            style={{ width: 72, height: 'auto' }}
            priority
          />
        </header>

        <main id="main-content" className="flex-1 p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
