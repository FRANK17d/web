import Image from 'next/image'
import { AnimateOnScroll } from '@/components/marketing/animate-on-scroll'
import { ScrollReactive } from '@/components/marketing/scroll-reactive'

export function HowItWorksSection() {
  return (
    <section className="relative py-24 lg:py-36 bg-white overflow-hidden">
      {/* Subtle background accent */}
      <div className="pointer-events-none absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-mkt-accent-light/[0.03] to-transparent" />

      {/* Doodle arrow — bottom right */}
      <div className="pointer-events-none absolute bottom-10 right-8 sm:bottom-14 sm:right-14 lg:bottom-20 lg:right-24 z-10 hidden sm:block">
        <ScrollReactive mode="bounce" className="inline-block">
          <Image src="/flecha.webp" alt="" width={140} height={100} className="h-14 w-auto sm:h-18 lg:h-22 opacity-60 rotate-[30deg] scale-x-[-1]" aria-hidden="true" />
        </ScrollReactive>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16 xl:gap-24">
          {/* Left — Image composition (desktop only) */}
          <AnimateOnScroll variant="fade-right" className="relative flex-shrink-0 hidden lg:block lg:w-[48%]">
            <ScrollReactive mode="zoom">
              <Image
                src="/chica-tecnicos.webp"
                alt="Cliente usando toke+ para conectar con técnicos verificados"
                width={1080}
                height={1080}
                sizes="48vw"
                className="w-full h-auto object-contain drop-shadow-lg"
              />
            </ScrollReactive>
          </AnimateOnScroll>

          {/* Right — Copy */}
          <AnimateOnScroll variant="fade-left" delay={200} className="flex-1 max-w-xl lg:max-w-none">
            <h2 className="text-3xl font-extrabold tracking-tight text-neutral-800 sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
              Somos la forma más rápida
              <br />
              para dar con la solución
            </h2>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-neutral-800 sm:text-xl">
                ¿Cómo funciona? Es muy sencillo.
              </h3>

              {/* Steps with left accent border */}
              <div className="mt-6 space-y-6">
                {/* Step 1 */}
                <div className="relative border-l-[3px] border-mkt-accent-light pl-6">
                  <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">
                    Como cliente, describís lo que necesitas y nosotros te
                    conectamos con los prestadores.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="pl-6">
                  <p className="text-sm leading-relaxed text-neutral-500 sm:text-base">
                    Ejemplo: «Necesito que pinten mi sala», toke+ notifica a los pintores cercanos y
                    los interesados ingresan a tu pedido.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="pl-6">
                  <p className="text-sm leading-relaxed text-neutral-500 sm:text-base">
                    Cuando una propuesta te gusta, coordinas con él los detalles y listo 🤝
                  </p>
                </div>

                {/* Step 4 — for professionals */}
                <div className="pl-6 pt-2 border-t border-neutral-100">
                  <p className="text-sm leading-relaxed text-neutral-500 sm:text-base">
                    De esa forma como prestador de servicios podés hacer nuevos clientes y crece tu
                    cartera 💪
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <a
              href="#descargar"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-mkt-accent-light px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-mkt-accent shadow-lg shadow-mkt-accent-light/25 active:scale-[0.97]"
            >
              Empieza ahora
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
