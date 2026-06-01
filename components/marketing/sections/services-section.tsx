import Image from 'next/image'
import { services } from './data'

type Service = (typeof services)[number]

const row1 = [...services, ...services]
const row2 = [...[...services].reverse(), ...[...services].reverse()]

export function ServicesSection() {
  return (
    <section id="servicios" className="relative z-20 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main orange card */}
        <div className="relative rounded-3xl bg-mkt-accent-light overflow-visible">
          <div className="relative px-8 pt-12 pb-10 sm:px-12 sm:pt-16 sm:pb-12 lg:px-16 lg:pt-20 lg:pb-14">
            {/* Text — left side */}
            <div className="relative z-10 max-w-md lg:max-w-lg">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
                ¿Qué es toke+?
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-white/90 sm:text-base lg:text-[17px] lg:leading-[1.7]">
                Una app que te conecta con los mejores prestadores de servicios de manera rápida, segura y sin complicaciones.
                Con Inteligencia artificial analizamos tus necesidades para recomendarte profesionales cercanos y calificados.
              </p>
            </div>

            {/* Phone — absolute right, wrist touches card bottom edge */}
            <div className="pointer-events-none absolute right-4 bottom-0 z-20 hidden w-[44%] lg:block xl:right-8 xl:w-[42%] overflow-hidden">
              {/* Fade bottom edge (wrist area) into card background */}
              <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top, rgba(238,112,112,1) 0%, rgba(238,112,112,0.4) 8%, transparent 18%)' }} />
              <Image
                src="/mano-celular.webp"
                alt="Mano sosteniendo la app toke+"
                width={800}
                height={960}
                sizes="(min-width: 1280px) 500px, (min-width: 1024px) 44vw, 0px"
                className="w-full h-auto object-contain object-right-bottom"
              />
            </div>

            {/* Carousel — below text, left side on desktop */}
            <div className="relative z-30 mt-10 -mx-8 sm:-mx-12 lg:mx-0 lg:mt-12 lg:w-[58%] xl:w-[55%] overflow-hidden">
              {/* Row 1 — scrolls left */}
              <div className="relative py-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-mkt-accent-light to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-mkt-accent-light to-transparent" />
                <div className="flex w-max gap-3 animate-carousel-left">
                  {row1.map((service, i) => (
                    <ServicePill key={`r1-${service.name}-${i}`} service={service} />
                  ))}
                </div>
              </div>

              {/* Row 2 — scrolls right */}
              <div className="relative mt-3 pb-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-mkt-accent-light to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-mkt-accent-light to-transparent" />
                <div className="flex w-max gap-3 animate-carousel-right">
                  {row2.map((service, i) => (
                    <ServicePill key={`r2-${service.name}-${i}`} service={service} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ServicePill({ service }: { service: Service }) {
  return (
    <div className="pill-interactive flex shrink-0 items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm">
      <Image
        src={service.icon}
        alt={service.name}
        width={40}
        height={40}
        sizes="32px"
        className="h-8 w-8 object-contain"
      />
      <span className="whitespace-nowrap text-sm font-semibold text-neutral-700">
        {service.name}
      </span>
    </div>
  )
}
