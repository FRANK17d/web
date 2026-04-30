import Image from 'next/image'
import { services } from './data'

type Service = (typeof services)[number]

const forwardCarouselServices = [...services, ...services]
const reversedServices = [...services].reverse()
const reversedCarouselServices = [...reversedServices, ...reversedServices]

export function ServicesSection() {
  return (
    <section id="servicios" className="relative z-20 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Rounded card container */}
        <div className="relative overflow-visible rounded-3xl bg-[#F28B82] px-8 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
          {/* Copy — left side, white text */}
          <div className="relative z-10 max-w-md lg:max-w-lg">
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl leading-tight">
              ¿Qué es toke+?
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-white/90 sm:text-base">
              Una app que te conecta con los mejores profesionales de manera rápida, segura y sin complicaciones. Analizamos tus necesidades para recomendarte técnicos cercanos y calificados.
            </p>
          </div>

          {/* Hand image — overflows right edge on desktop */}
          <div className="pointer-events-none absolute -right-8 -top-12 z-20 hidden w-[48%] lg:block xl:-right-10 xl:-top-16">
            <Image
              src="/mano-celular.png"
              alt="Mano sosteniendo la app toke+"
              width={800}
              height={960}
              sizes="(min-width: 1280px) 570px, (min-width: 1024px) 48vw, 0px"
              className="w-full h-auto object-contain object-right-bottom drop-shadow-2xl"
            />
          </div>

          {/* Hand image — mobile, centered inside card */}
          <div className="relative z-10 mx-auto mt-8 w-[220px] sm:w-[280px] lg:hidden">
            <Image
              src="/mano-celular.png"
              alt="Mano sosteniendo la app toke+"
              width={800}
              height={960}
              sizes="(min-width: 640px) 280px, 220px"
              className="w-full h-auto object-contain drop-shadow-xl"
            />
          </div>

          {/* Carousel inside the card — crosses bottom visually */}
          <div className="relative z-30 mt-8 -mx-8 overflow-hidden sm:-mx-12 lg:mx-0 lg:mt-12 lg:w-[62%] xl:w-[64%]">
            {/* Row 1 — scrolls left */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#F28B82] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#F28B82] to-transparent" />

              <ServiceCarouselRow
                animationClass="animate-carousel-left"
                items={forwardCarouselServices}
                keyPrefix="forward"
              />
            </div>

            {/* Row 2 — scrolls right */}
            <div className="relative mt-3">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#F28B82] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#F28B82] to-transparent" />

              <ServiceCarouselRow
                animationClass="animate-carousel-right"
                items={reversedCarouselServices}
                keyPrefix="reverse"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ServiceCarouselRow({
  animationClass,
  items,
  keyPrefix,
}: {
  animationClass: 'animate-carousel-left' | 'animate-carousel-right'
  items: Service[]
  keyPrefix: string
}) {
  return (
    <div className={`flex w-max gap-4 ${animationClass}`}>
      {items.map((service, index) => (
        <ServicePill key={`${keyPrefix}-${service.name}-${index}`} service={service} />
      ))}
    </div>
  )
}

function ServicePill({ service }: { service: Service }) {
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-full bg-white/95 backdrop-blur-sm px-5 py-2.5 shadow-md transition-all duration-200 hover:bg-white hover:shadow-lg">
      <Image
        src={service.icon}
        alt={service.name}
        width={40}
        height={40}
        sizes="40px"
        className="h-8 w-8 object-contain"
      />
      <span className="whitespace-nowrap text-sm font-semibold text-neutral-700">
        {service.name}
      </span>
    </div>
  )
}
