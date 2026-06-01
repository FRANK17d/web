import Image from 'next/image'
import { AnimateOnScroll } from '@/components/marketing/animate-on-scroll'
import { ScrollReactive } from '@/components/marketing/scroll-reactive'
import { features } from './data'

export function FeaturesSection() {
  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* Doodle arrow — top left */}
      <div className="pointer-events-none absolute top-10 left-6 sm:top-14 sm:left-12 lg:top-16 lg:left-20 z-10 hidden sm:block">
        <ScrollReactive mode="bounce" className="inline-block">
          <Image src="/flecha.webp" alt="" width={140} height={100} className="h-14 w-auto sm:h-18 lg:h-22 opacity-60 rotate-[160deg]" aria-hidden="true" />
        </ScrollReactive>
      </div>
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <AnimateOnScroll variant="fade-up" className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-mkt-accent-light">¿Qué puedo hacer en toke+?</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-800 sm:text-4xl lg:text-5xl">Algunas funcionalidades</h2>
        </AnimateOnScroll>
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <AnimateOnScroll key={f.title} variant="zoom-in" delay={i * 150} className={f.spanClass ?? ''}>
              <div className="group hover-lift flex flex-col items-center text-center rounded-2xl p-6">
                <div className="relative mb-6 flex h-40 w-40 items-center justify-center">
                  <Image src={f.image} alt={f.alt} width={160} height={160} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1" />
                </div>
                <h3 className="text-lg font-bold text-neutral-800">{f.title}</h3>
                <p className="mt-3 max-w-[280px] text-sm leading-relaxed text-neutral-500">{f.description}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
