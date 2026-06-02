'use client'

import { useEffect, useRef, type ReactNode } from 'react'

type AnimationVariant =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'bounce'

interface AnimateOnScrollProps {
  children: ReactNode
  className?: string
  variant?: AnimationVariant
  delay?: number
  duration?: number
  once?: boolean
}

/**
 * Lightweight scroll-triggered animation component.
 * Uses Intersection Observer + CSS transforms (GPU-accelerated).
 * Zero external dependencies. Respects prefers-reduced-motion.
 */
export function AnimateOnScroll({
  children,
  className = '',
  variant = 'fade-up',
  delay = 0,
  duration = 600,
  once = true,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect reduced motion preference — show content instantly
    // (bounce variant still appears, just without animation)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('aos-visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('aos-visible')
          if (once) observer.unobserve(el)
        } else if (!once) {
          el.classList.remove('aos-visible')
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  return (
    <div
      ref={ref}
      className={`aos-element aos-${variant} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  )
}


