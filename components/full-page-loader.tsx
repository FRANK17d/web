'use client'

import { Logo } from '@/components/logo'
import { createPortal } from 'react-dom'

interface FullPageLoaderProps {
  label?: string
}

export function FullPageLoader({ label = 'Preparando tu experiencia...' }: FullPageLoaderProps) {
  const content = (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center w-[100vw] h-[100dvh] bg-surface-50/80 backdrop-blur-sm antialiased">
      {/* Contenedor del Spinner Custom */}
      <div className="relative flex items-center justify-center">
        {/* Aro exterior sutil (estático como riel) */}
        <div className="absolute h-24 w-24 rounded-full border-[3px] border-surface-200/50" />
        
        {/* Aro vibrante de carga (gira) */}
        <div 
          className="absolute h-24 w-24 animate-spin rounded-full border-[3px] border-transparent border-t-brand-600 border-r-brand-600/30" 
          style={{ animationDuration: '1.5s' }}
        />
        
        {/* Círculo central blanco con sombra elegante y Logo */}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl shadow-brand-900/5 ring-1 ring-surface-900/5">
          <Logo className="h-7 w-7 text-brand-600 animate-pulse" />
        </div>
      </div>
      
      {/* Branding y Texto de estado */}
      <div className="mt-8 flex flex-col items-center gap-1.5">
        <h3 className="text-base font-semibold tracking-tight text-surface-900">MaestroYa</h3>
        <p className="text-sm font-medium text-surface-500 animate-pulse">
          {label}
        </p>
      </div>
    </div>
  )

  // En el cliente, lo montamos en el body para escapar de cualquier contenedor con animaciones CSS (z-index fixing)
  if (typeof document !== 'undefined') {
    return createPortal(content, document.body)
  }

  // Pre-render natural SSR
  return content
}
