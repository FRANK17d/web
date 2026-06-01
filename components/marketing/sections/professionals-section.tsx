import Image from 'next/image'
import { AnimateOnScroll } from '@/components/marketing/animate-on-scroll'
import { ScrollReactive } from '@/components/marketing/scroll-reactive'
import { GooglePlayIcon, AppleIcon } from '@/components/marketing/store-icons'
import { professionalBenefits } from './data'

export function ProfessionalsSection() {
  return (
    <section id="profesionales" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* Doodle arrow — top right corner */}
      <div className="pointer-events-none absolute top-8 right-6 sm:top-12 sm:right-14 lg:top-14 lg:right-20 z-10 hidden sm:block">
        <ScrollReactive mode="bounce" className="inline-block">
          <Image src="/flecha.webp" alt="" width={140} height={100} className="h-14 w-auto sm:h-18 lg:h-22 opacity-60 rotate-[45deg]" aria-hidden="true" />
        </ScrollReactive>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#EE7070_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.03]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16 xl:gap-24">
          {/* Left — Phone mockup */}
          <AnimateOnScroll variant="fade-right" className="relative flex-shrink-0 lg:w-[40%]">
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[80%] w-[80%] rounded-full bg-gradient-to-br from-mkt-accent-light/10 to-mkt-accent-light/5 blur-3xl" />
            <div className="relative mx-auto w-[220px] xs:w-[250px] sm:w-[300px]">
              <div className="overflow-hidden rounded-[2.5rem] border-[6px] border-neutral-800 bg-neutral-800 shadow-2xl shadow-neutral-900/30">
                <div className="flex items-center justify-between bg-neutral-800 px-6 py-2">
                  <span className="text-[10px] font-medium text-white/70">9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-white/70" />
                    <div className="h-2 w-3 rounded-sm bg-white/70" />
                  </div>
                </div>
                <Image src="/prestador.webp" alt="Panel profesional de toke+" width={600} height={1200} sizes="(min-width: 640px) 300px, (min-width: 400px) 250px, 220px" className="w-full h-auto" />
              </div>
              <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-neutral-300" />
            </div>
            {/* Floating badges */}
            <div className="absolute -right-2 top-16 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-lg border border-neutral-100 animate-floating sm:-right-8 sm:px-4 sm:py-2.5">
              <span className="text-base sm:text-lg">⭐</span>
              <div><p className="text-[10px] sm:text-xs font-bold text-neutral-800">4.9 / 5.0</p><p className="text-[9px] sm:text-[10px] text-neutral-400">Calificación</p></div>
            </div>
            <div className="absolute -left-2 bottom-32 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-lg border border-neutral-100 sm:-left-8 sm:px-4 sm:py-2.5 animate-floating [animation-delay:0.5s]">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-green-100 text-xs sm:text-sm">✅</div>
              <div><p className="text-[10px] sm:text-xs font-bold text-neutral-800">Verificado</p><p className="text-[9px] sm:text-[10px] text-neutral-400">Identidad</p></div>
            </div>
          </AnimateOnScroll>
          {/* Right — Copy */}
          <AnimateOnScroll variant="fade-left" delay={200} className="flex-1 lg:max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mkt-accent-light">Panel profesional</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-800 sm:text-4xl lg:text-[42px] lg:leading-[1.12]">¿Brindas un servicio?</h2>
            <div className="mt-8">
              <h3 className="text-lg font-bold text-neutral-800">Prestadores de servicio</h3>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-neutral-600">
                ¿Tenés experiencia en plomería, electricidad, pintura, jardinería u otro oficio? Con <span className="font-semibold text-neutral-800">toke+</span> podés conseguir clientes, gestionar tu trabajo y generar ingresos desde tu celular.
              </p>
            </div>
            <div className="mt-8">
              <p className="text-sm font-bold text-neutral-800 mb-4">Beneficios:</p>
              <ul className="space-y-3">
                {professionalBenefits.map((b) => (
                  <li key={b.text} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-mkt-accent-light/10 text-sm">{b.icon}</span>
                    <span className="text-sm text-neutral-600 leading-relaxed">{b.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#descargar" className="inline-flex items-center gap-2.5 rounded-full bg-mkt-accent-light px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-mkt-accent shadow-lg shadow-mkt-accent-light/25 active:scale-[0.97]">
                <GooglePlayIcon className="h-5 w-5" />
                Google Play
              </a>
              <a href="#descargar" className="inline-flex items-center gap-2.5 rounded-full border-2 border-neutral-800 bg-white px-7 py-3.5 text-sm font-semibold text-neutral-800 transition-all duration-200 hover:bg-neutral-800 hover:text-white active:scale-[0.97]">
                <AppleIcon className="h-5 w-5" />
                App Store
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
