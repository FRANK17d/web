'use client'

import { type ReactNode, useEffect, useRef } from 'react'

type ScrollReactiveProps = {
  children: ReactNode
  className?: string
  /** 'zoom' = scale on scroll, 'bounce' = translateY bounce on scroll direction */
  mode: 'zoom' | 'bounce'
}

/**
 * Lightweight scroll-direction-reactive wrapper.
 * - zoom: scales up when scrolling down, scales back when idle
 * - bounce: shifts down on scroll-down, shifts up on scroll-up, resets after 200ms
 * Uses CSS custom properties + RAF. Zero layout thrash.
 */
export function ScrollReactive({ children, className = '', mode }: ScrollReactiveProps) {
  const ref = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef(0)
  const resetTimer = useRef<number | null>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    lastScrollY.current = window.scrollY

    const apply = (value: string) => {
      frameRef.current = null
      const prop = mode === 'zoom' ? '--scroll-zoom' : '--scroll-bounce-y'
      el.style.setProperty(prop, value)
    }

    const schedule = (value: string) => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
      frameRef.current = window.requestAnimationFrame(() => apply(value))
    }

    const handleScroll = () => {
      if (!el) return

      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY.current

      if (Math.abs(delta) < 2) return

      if (mode === 'zoom') {
        schedule(delta > 0 ? '1.08' : '0.94')
      } else {
        schedule(delta > 0 ? '14px' : '-14px')
      }

      if (resetTimer.current) window.clearTimeout(resetTimer.current)

      resetTimer.current = window.setTimeout(() => {
        schedule(mode === 'zoom' ? '1' : '0px')
      }, 250)

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (resetTimer.current) window.clearTimeout(resetTimer.current)
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
    }
  }, [mode])

  const cssClass = mode === 'zoom' ? 'scroll-reactive-zoom' : 'scroll-reactive-bounce'

  return (
    <div ref={ref} className={`${cssClass} ${className}`}>
      {children}
    </div>
  )
}
