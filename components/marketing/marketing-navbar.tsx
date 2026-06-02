'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { TokeLogo } from './toke-logo'
import { Menu, X, Download } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/servicios', label: 'Servicios' },
]

export function MarketingNavbar() {
  const [open, setOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const isScrolledRef = useRef(false)
  const frameRef = useRef<number | null>(null)
  const pathname = usePathname()

  // Scroll-reactive navbar shrink
  useEffect(() => {
    const syncScrollState = () => {
      frameRef.current = null
      const nextIsScrolled = window.scrollY > 20

      if (nextIsScrolled === isScrolledRef.current) {
        return
      }

      isScrolledRef.current = nextIsScrolled
      setIsScrolled(nextIsScrolled)
    }

    const requestSync = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(syncScrollState)
      }
    }

    syncScrollState()
    window.addEventListener('scroll', requestSync, { passive: true })

    return () => {
      window.removeEventListener('scroll', requestSync)
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  // Close menu on scroll (dropdown should dismiss)
  useEffect(() => {
    if (!open) return
    const dismiss = () => setOpen(false)
    window.addEventListener('scroll', dismiss, { passive: true, once: true })
    return () => window.removeEventListener('scroll', dismiss)
  }, [open])

  // Close on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false)
  }, [])

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, handleKeyDown])

  return (
    <header
      className={`fixed left-0 right-0 top-3 z-50 px-4 transition-all duration-300 sm:px-6 ${
        isScrolled ? 'lg:top-0 lg:pt-0' : 'lg:top-4 lg:pt-4'
      }`}
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-3xl bg-white py-2 pl-4 pr-5 shadow-lg shadow-black/10 transition-all duration-300 sm:pl-5 sm:pr-8 ${
          isScrolled ? 'lg:rounded-t-none lg:rounded-b-3xl' : 'lg:rounded-3xl'
        }`}
      >
        {/* Logo — red color, scales down layout height on scroll so navbar shrinks */}
        <Link
          href="/"
          className={`relative z-10 -ml-1 flex h-14 shrink-0 items-center transition-all duration-300 sm:-ml-2 ${
            isScrolled ? 'lg:h-10' : 'lg:h-14'
          }`}
        >
          <TokeLogo size='lg' variant="color" className="h-full w-auto transition-all duration-300 object-contain" />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base font-bold transition-all duration-300 hover:text-mkt-accent ${
                  isActive ? 'text-mkt-accent-light' : 'text-neutral-700'
                } ${isScrolled ? 'lg:text-sm' : 'lg:text-base'}`}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            href="/#descargar"
            className={`flex items-center gap-2 rounded-full bg-mkt-accent px-6 py-2 text-base font-bold text-white transition-all duration-300 hover:bg-mkt-accent-hover active:scale-[0.97] ${
              isScrolled ? 'lg:px-5 lg:py-1.5 lg:text-sm' : 'lg:px-6 lg:py-2 lg:text-base'
            }`}
          >
            <span>Descargar la app</span>
            <Download
              className={`h-5 w-5 transition-all duration-300 ${
                isScrolled ? 'lg:h-4 lg:w-4' : 'lg:h-5 lg:w-5'
              }`}
            />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl text-neutral-700 md:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu — dropdown panel below nav */}
      <div
        id="mobile-nav-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={`absolute left-4 right-4 top-full mt-2 z-40 rounded-2xl bg-white px-6 py-5 shadow-xl shadow-black/10 border border-neutral-100 md:hidden transition-all duration-200 origin-top ${
          open ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col gap-4">
          {navLinks.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-base font-semibold transition-colors hover:text-mkt-accent ${
                  isActive ? 'text-mkt-accent-light' : 'text-neutral-800'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            href="/#descargar"
            onClick={() => setOpen(false)}
            className="text-base font-semibold text-neutral-800 transition-colors hover:text-mkt-accent"
          >
            Descargar la app
          </Link>
        </nav>
      </div>
    </header>
  )
}
