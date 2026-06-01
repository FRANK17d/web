import Image from 'next/image'
import { AnimateOnScroll } from '@/components/marketing/animate-on-scroll'
import { ScrollReactive } from '@/components/marketing/scroll-reactive'

export function StepsSection() {
  return (
    <section id="como-funciona" className="relative py-24 lg:py-32 bg-neutral-50 border-t border-neutral-100 overflow-hidden">
      {/* Doodle arrow — right side */}
      <div className="pointer-events-none absolute top-20 right-4 sm:top-24 sm:right-10 lg:top-28 lg:right-16 z-10 hidden sm:block">
        <ScrollReactive mode="bounce" className="inline-block">
          <Image src="/flecha.webp" alt="" width={140} height={100} className="h-14 w-auto sm:h-18 lg:h-22 opacity-50 rotate-[-25deg] scale-x-[-1]" aria-hidden="true" />
        </ScrollReactive>
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16 xl:gap-20">
          <AnimateOnScroll variant="fade-right" className="flex-shrink-0 lg:w-[42%] lg:sticky lg:top-32">
            <h2 className="text-3xl font-extrabold tracking-tight text-neutral-800 sm:text-4xl lg:text-[40px] lg:leading-[1.15]">
              ¿Cómo pedir un<br />servicio para tu hogar?
            </h2>
            <div className="mt-8 overflow-hidden rounded-3xl shadow-lg">
              <Image src="/señor-sentado.webp" alt="Cliente usando toke+ desde su sofá" width={800} height={700} sizes="(min-width: 1024px) 42vw, 100vw" className="w-full h-auto object-cover" />
            </div>
          </AnimateOnScroll>
          <div className="flex-1 flex flex-col gap-5 lg:pt-2">
            <AnimateOnScroll variant="fade-up" delay={0}>
              <StepCard n={1} title="Pedí el servicio que necesitás" subtitle="Describe simple y directo." detail="Ejemplo: Necesito alguien que pueda pintar la sala de mi casa." />
            </AnimateOnScroll>
            <AnimateOnScroll variant="fade-up" delay={150}>
              <StepCard n={2} title="Elegí entre trabajadores calificados cercanos" subtitle="Recibe interesados" detail="Analizá las propuestas recibidas considerando aspectos como el presupuesto, el perfil profesional, insignias y las valoraciones de otros clientes." />
            </AnimateOnScroll>
            <AnimateOnScroll variant="fade-up" delay={300}>
              <StepCard n={3} title="Al finalizar, calificas al trabajador" subtitle="Tu experiencia es clave" detail="Das tu calificación y un comentario sobre el servicio recibido para ayudar a futuros clientes en su decisión." />
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  )
}

function StepCard({ n, title, subtitle, detail }: { n: number; title: string; subtitle: string; detail: string }) {
  return (
    <div className="hover-lift rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-neutral-100">
      <div className="flex gap-5">
        <div className="number-pop flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-mkt-accent-light text-xl font-black text-white">{n}</div>
        <div>
          <h3 className="text-lg font-bold text-neutral-800 sm:text-xl">{title}</h3>
          <p className="mt-1 text-sm font-semibold text-neutral-600">{subtitle}</p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">{detail}</p>
        </div>
      </div>
    </div>
  )
}
