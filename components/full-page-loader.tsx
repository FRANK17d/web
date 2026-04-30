'use client'

import Image from 'next/image'
import { createPortal } from 'react-dom'

interface FullPageLoaderProps {
  label?: string
}

export function FullPageLoader({ label = 'Preparando toke+...' }: FullPageLoaderProps) {
  const content = (
    <div className="fixed inset-0 z-50 flex h-[100dvh] w-[100vw] flex-col items-center justify-center overflow-hidden bg-white antialiased">
      {/* Ambient glow behind logo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[340px] w-[340px] rounded-full bg-[#EE7070]/[0.07] blur-[100px]" />
      </div>

      <div className="relative flex flex-col items-center">
        {/* Logo icon with pulse ring */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          {/* Outer pulse ring */}
          <div className="absolute inset-0 animate-[pulse-ring_2s_cubic-bezier(0.4,0,0.6,1)_infinite] rounded-3xl bg-[#EE7070]/10" />
          {/* Logo */}
          <Image
            src="/logo2_toke+.png"
            alt="toke+"
            width={96}
            height={120}
            className="relative z-10 w-24 rounded-[1.25rem] shadow-lg shadow-[#D94F4F]/20"
            priority
          />
        </div>

        {/* Text */}
        <p className="mt-7 text-[13px] font-medium tracking-wide text-neutral-400">
          {label}
        </p>

        {/* Dots loader */}
        <div className="mt-5 flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-[#EE7070] animate-[bounce-dot_1.4s_ease-in-out_infinite]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#EE7070] animate-[bounce-dot_1.4s_ease-in-out_0.2s_infinite]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#EE7070] animate-[bounce-dot_1.4s_ease-in-out_0.4s_infinite]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-ring {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.18);
            opacity: 0;
          }
        }
        @keyframes bounce-dot {
          0%, 80%, 100% {
            transform: scale(0.6);
            opacity: 0.3;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )

  if (typeof document !== 'undefined') {
    return createPortal(content, document.body)
  }

  return content
}
