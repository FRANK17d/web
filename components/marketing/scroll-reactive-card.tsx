'use client'

import { type ReactNode, useEffect, useRef } from 'react'

type ScrollReactiveCardProps = {
  children: ReactNode
  className?: string
}

export function ScrollReactiveCard({ children, className = '' }: ScrollReactiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef(0)
  const resetTimer = useRef<number | null>(null)
  const frameRef = useRef<number | null>(null)
  const nextShift = useRef('0px')

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    lastScrollY.current = window.scrollY

    const applyShift = () => {
      frameRef.current = null
      cardRef.current?.style.setProperty('--scroll-shift-y', nextShift.current)
    }

    const scheduleShift = (shift: string) => {
      nextShift.current = shift

      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(applyShift)
      }
    }

    const handleScroll = () => {
      if (reduceMotion.matches || !cardRef.current) {
        return
      }

      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY.current

      if (Math.abs(delta) < 2) {
        return
      }

      scheduleShift(delta > 0 ? '14px' : '-14px')

      if (resetTimer.current) {
        window.clearTimeout(resetTimer.current)
      }

      resetTimer.current = window.setTimeout(() => {
        scheduleShift('0px')
      }, 160)

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (resetTimer.current) {
        window.clearTimeout(resetTimer.current)
      }
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  return (
    <div ref={cardRef} className={`scroll-reactive-card ${className}`}>
      {children}
    </div>
  )
}
