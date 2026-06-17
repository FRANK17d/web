import Image from 'next/image'
import { TokeLogo } from '@/components/marketing/toke-logo'
import { AnimateOnScroll } from '@/components/marketing/animate-on-scroll'
import { GooglePlayIcon, AppleIcon } from '@/components/marketing/store-icons'
import { Shield, Lock, CircleCheck } from 'lucide-react'
import type { LandingSettings } from '@/lib/landing-settings'

const trustBadges = [
  { icon: Shield, label: 'Seguro y confiable' },
  { icon: Lock, label: 'Tus datos protegidos' },
  { icon: CircleCheck, label: 'Rápido y fácil de usar' },
]

export function DownloadCtaSection({ settings }: { settings: LandingSettings }) {
  const sectionBackground = `linear-gradient(135deg, color-mix(in srgb, ${settings.brandColor} 74%, white), ${settings.brandColor}, color-mix(in srgb, ${settings.brandColor} 80%, #111827))`

  return (
    <section id="descargar" className="relative overflow-hidden hero-gradient-shift" style={{ background: sectionBackground }}>
      {/* Dot pattern — top right */}
      <div className="pointer-events-none absolute top-0 right-0 w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] opacity-[0.12]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }} />
      </div>
      <div className="pointer-events-none absolute -bottom-20 right-[10%] h-[250px] w-[250px] lg:h-[350px] lg:w-[350px] rounded-full bg-white/[0.06]" />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8 py-10 lg:py-12">
        <div className="flex flex-col items-center gap-2 lg:flex-row lg:items-center lg:gap-0">

          {/* Left — Copy */}
          <AnimateOnScroll variant="fade-right" className="flex-1 text-center lg:text-left">
            <TokeLogo size="md" variant="white" src={settings.logoUrl || undefined} className="justify-center lg:justify-start" />

            <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl leading-[1.1] tracking-tight">
              Descarga la app<br />y empieza hoy
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/85 sm:text-base lg:mx-0">
              {settings.promoBanner}
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href={settings.androidUrl}
                className="cta-pulse group inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3 text-sm font-bold text-mkt-accent shadow-lg shadow-black/10 transition-all duration-200 hover:scale-[1.03] hover:shadow-xl active:scale-[0.97]"
              >
                <GooglePlayIcon className="h-5 w-5" />
                Google Play
              </a>
              <a
                href={settings.iosUrl}
                className="group inline-flex items-center gap-2.5 rounded-full border-2 border-white/50 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:border-white/70 hover:scale-[1.03] active:scale-[0.97]"
              >
                <AppleIcon className="h-5 w-5" />
                Próximamente en iOS
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start">
              {trustBadges.map((badge, i) => (
                <div key={badge.label} className="flex items-center gap-1.5 text-white/90">
                  <badge.icon className="h-3.5 w-3.5" />
                  <span className="text-[11px] font-semibold sm:text-xs">{badge.label}</span>
                  {i < trustBadges.length - 1 && (
                    <span className="ml-3 hidden h-3.5 w-px bg-white/30 sm:block" />
                  )}
                </div>
              ))}
            </div>
          </AnimateOnScroll>

          {/* Right — Mockup image (toke-section) */}
          <AnimateOnScroll variant="fade-left" delay={150} className="relative flex-shrink-0">
            <Image
              src="/toke-section.webp"
              alt="App toke+ con icono 3D"
              width={930}
              height={1173}
              sizes="(min-width: 1024px) 340px, (min-width: 640px) 280px, 220px"
              className="w-[220px] sm:w-[280px] lg:w-[340px] h-auto drop-shadow-2xl"
              loading="lazy"
            />
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
