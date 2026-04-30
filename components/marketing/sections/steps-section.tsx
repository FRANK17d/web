import Image from 'next/image'

export function StepsSection() {
  return (
    <section id="como-funciona" className="relative py-24 lg:py-32 bg-neutral-50 border-t border-neutral-100 overflow-hidden">
      <div className="pointer-events-none absolute top-10 left-10 text-neutral-800 opacity-15 hidden lg:block">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-[135deg]">
          <path d="M7 17L17 7" /><path d="M7 7h10v10" />
        </svg>
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16 xl:gap-20">
          <div className="flex-shrink-0 lg:w-[42%] lg:sticky lg:top-32">
            <h2 className="text-3xl font-extrabold tracking-tight text-neutral-800 sm:text-4xl lg:text-[40px] lg:leading-[1.15]">
              ¿Cómo pedir un<br />servicio para tu hogar?
            </h2>
            <div className="mt-8 overflow-hidden rounded-3xl shadow-lg">
              <Image src="/señor-sentado.jpg" alt="Cliente usando toke+ desde su sofá" width={800} height={700} className="w-full h-auto object-cover" quality={90} />
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-5 lg:pt-2">
            <StepCard n={1} title="Pedí el servicio que necesitás" subtitle="Describe simple y directo." detail="Ejemplo: Necesito alguien que pueda pintar la sala de mi casa." />
            <StepCard n={2} title="Elegí entre trabajadores calificados cercanos" subtitle="Recibe interesados" detail="Analizá las propuestas recibidas considerando aspectos como el presupuesto, el perfil profesional, insignias y las valoraciones de otros clientes." />
            <StepCard n={3} title="Al finalizar, calificas al trabajador" subtitle="Tu experiencia es clave" detail="Das tu calificación y un comentario sobre el servicio recibido para ayudar a futuros clientes en su decisión." />
          </div>
        </div>
      </div>
    </section>
  )
}

function StepCard({ n, title, subtitle, detail }: { n: number; title: string; subtitle: string; detail: string }) {
  return (
    <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-neutral-100 transition-all duration-300 hover:shadow-md hover:border-[#EE7070]/20">
      <div className="flex gap-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EE7070] text-xl font-black text-white">{n}</div>
        <div>
          <h3 className="text-lg font-bold text-neutral-800 sm:text-xl">{title}</h3>
          <p className="mt-1 text-sm font-semibold text-neutral-600">{subtitle}</p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">{detail}</p>
        </div>
      </div>
    </div>
  )
}
