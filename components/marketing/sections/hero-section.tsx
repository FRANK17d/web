import Image from 'next/image'
import { GooglePlayIcon, AppleIcon } from '@/components/marketing/store-icons'
import type { LandingSettings } from '@/lib/landing-settings'

const wavePatternStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='20' viewBox='0 0 120 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q 30 0, 60 10 T 120 10' fill='none' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundSize: '120px 20px',
  backgroundRepeat: 'repeat',
} as const

function splitTitle(title: string) {
  return title.split('\n').filter(Boolean)
}

export function HeroSection({ settings }: { settings: LandingSettings }) {
  const heroTitleLines = splitTitle(settings.heroTitle)
  const heroBackground = `linear-gradient(135deg, color-mix(in srgb, ${settings.brandColor} 74%, white), ${settings.brandColor}, color-mix(in srgb, ${settings.brandColor} 80%, #111827))`

  return (
    <section className="relative z-30 min-h-[90vh] flex items-center overflow-x-clip overflow-y-visible hero-gradient-shift pt-28 pb-20 lg:pt-36 lg:pb-28" style={{ background: heroBackground }}>
      {/* Wavy pattern background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="hero-wave-motion absolute inset-y-0 -inset-x-[120px] opacity-[0.15]"
          style={wavePatternStyle}
        />
      </div>

      {/* Curved bottom divider to replace the linear gradient */}
      <div className="absolute bottom-[-1px] left-0 right-0 w-full overflow-hidden leading-none z-20">
        <svg className="relative block w-full h-[40px] sm:h-[60px] lg:h-[80px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,120 C300,120 400,0 600,0 C800,0 900,120 1200,120 Z" fill="#ffffff"></path>
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 z-40 w-full lg:px-8">
        <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:gap-4 lg:text-left xl:gap-6">
          {/* Copy column */}
          <div className="flex-1 max-w-xl lg:max-w-[42rem] lg:pl-8 xl:pl-12">
            <h1 className="mt-10 text-3xl font-bold leading-[1.1] text-white text-shimmer sm:text-4xl lg:mt-0 lg:text-[52px] lg:leading-[1.2]">
              {heroTitleLines.map((line, index) => (
                <span key={`${line}-${index}`} className={index === 1 ? 'lg:whitespace-nowrap' : undefined}>
                  {index > 0 && <br />}
                  {line}
                </span>
              ))}
            </h1>

            <p className="mx-auto mt-6 max-w-lg text-lg font-normal leading-relaxed text-white/95 sm:text-xl lg:mx-0 lg:max-w-[30rem] lg:text-[26px] lg:leading-[1.25]">
              {settings.heroSubtitle}
            </p>

            <div className="hero-store-buttons mt-10 flex items-center justify-center gap-4 lg:justify-start">
              <a
                href={settings.androidUrl}
                className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-white px-6 py-3.5 text-base font-bold text-white transition-all duration-300 hover:bg-white hover:text-mkt-accent sm:px-8"
              >
                <GooglePlayIcon className="h-5 w-5 mr-1" />
                Google Play
              </a>
              <a
                href={settings.iosUrl}
                className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-white px-6 py-3.5 text-base font-bold text-white transition-all duration-300 hover:bg-white hover:text-mkt-accent sm:px-8"
              >
                <AppleIcon className="h-6 w-6" />
                App Store
              </a>
            </div>
          </div>

          {/* Hero image & floating icon */}
          <div className="relative z-30 mx-auto mt-12 flex shrink-0 justify-center sm:mt-14 lg:mx-0 lg:mt-0 lg:ml-2 lg:translate-y-6">
            <div className="relative w-[220px] sm:w-[250px] md:w-[265px] lg:h-[570px] lg:w-[290px] animate-floating">
              {/* Resplandor ambiental rojo para potenciar la iluminación */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[100%] bg-red-500/30 blur-[60px] rounded-full z-0" />
              
              {/* Resplandor de contorno intenso */}
              <Image
                src={settings.heroImageUrl}
                alt="App toke+ mostrando servicios"
                width={290}
                height={570}
                sizes="(min-width: 1024px) 290px, (min-width: 768px) 265px, (min-width: 640px) 250px, 220px"
                className="hero-phone-perspective relative z-10 h-auto w-full lg:h-[570px] lg:w-[290px] object-contain contrast-95 brightness-105 drop-shadow-[0_0_35px_rgba(255,33,49,0.9)]"
                priority
              />

              {/* Floating 3D Icon overlay — clamped to avoid overflow on mobile */}
              <div className="hero-toke-icon absolute z-[70]">
                <div className="toke-icon-motion">
                  <Image
                    src="/toke-3d-icon.webp"
                    alt="toke+ 3D Icon"
                    width={220}
                    height={220}
                    sizes="(min-width: 1024px) 220px, (min-width: 640px) 176px, (min-width: 430px) 160px, 136px"
                    className="drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
