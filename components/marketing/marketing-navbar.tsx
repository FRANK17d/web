'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-base font-bold text-neutral-700 transition-all duration-300 hover:text-[#D94F4F] ${
                isScrolled ? 'lg:text-sm' : 'lg:text-base'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#descargar"
            className={`flex items-center gap-2 rounded-full bg-[#D94F4F] px-6 py-2 text-base font-bold text-white transition-all duration-300 hover:bg-[#C44545] active:scale-[0.97] ${
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
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-40 flex flex-col bg-white px-6 pt-24 pb-8 md:hidden">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-xl font-semibold text-neutral-800 transition-colors hover:text-[#D94F4F]"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto">
            <Link
              href="/#descargar"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#D94F4F] py-4 text-base font-semibold text-white transition-all hover:bg-[#C44545]"
            >
              <span>Descarga la app</span>
              <Download className="h-5 w-5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
