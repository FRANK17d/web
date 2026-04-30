import Image from 'next/image'
import { ScrollReactiveCard } from '@/components/marketing/scroll-reactive-card'

export function ProblemSection() {
  return (
    <section className="relative py-24 lg:py-40 bg-white overflow-hidden">
      {/* Background Map Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent z-10" />
        <Image 
          src="/mapa-toke.png" 
          alt="Mapa de ubicaciones de técnicos" 
          fill 
          className="object-cover object-center opacity-90"
          quality={100}
          unoptimized
        />
      </div>
      
      {/* Content Container */}
      <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-[22rem] sm:max-w-md xl:mx-0 xl:max-w-[32rem]">
          <ScrollReactiveCard className="rounded-[1.5rem] bg-white p-5 text-center shadow-[0_20px_50px_rgba(0,0,0,0.08)] ring-1 ring-black/5 sm:rounded-[1.75rem] sm:p-7 md:p-8 xl:rounded-[2rem] xl:p-10 xl:text-left">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#EE7070] sm:text-xs">
              Problema y oportunidad
            </p>
            <h2 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-neutral-800 sm:text-3xl xl:mt-3 xl:text-4xl">
              Conseguir ayuda para tu hogar no debería ser tan difícil
            </h2>
            <div className="mt-5 space-y-3 text-sm font-medium leading-relaxed text-neutral-600 sm:text-[15px] xl:mt-6 xl:space-y-4 xl:text-base">
              <p>
                Cada año miles de hogares enfrentan problemas comunes:
                caños rotos, aires acondicionados que ya no enfrían o
                enchufes que dejan de funcionar.
              </p>
              <p>
                La mayoría no sabe a quién recurrir y termina perdiendo
                tiempo, dinero o incluso su seguridad.
              </p>
            </div>
          </ScrollReactiveCard>
        </div>
      </div>
    </section>
  )
}
