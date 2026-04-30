import Image from 'next/image'
import { features } from './data'

export function FeaturesSection() {
  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="pointer-events-none absolute top-12 right-12 text-neutral-800 opacity-20 hidden lg:block">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-[-30deg]">
          <path d="M7 17L17 7" /><path d="M7 7h10v10" />
        </svg>
      </div>
      <div className="pointer-events-none absolute bottom-16 left-12 text-neutral-800 opacity-20 hidden lg:block">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-[150deg]">
          <path d="M7 17L17 7" /><path d="M7 7h10v10" />
        </svg>
      </div>
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#EE7070]">¿Qué puedo hacer en toke+?</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-800 sm:text-4xl lg:text-5xl">Algunas funcionalidades</h2>
        </div>
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className={`group flex flex-col items-center text-center ${f.spanClass ?? ''}`}>
              <div className="relative mb-6 flex h-40 w-40 items-center justify-center">
                <Image src={f.image} alt={f.alt} width={160} height={160} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1" />
              </div>
              <h3 className="text-lg font-bold text-neutral-800">{f.title}</h3>
              <p className="mt-3 max-w-[280px] text-sm leading-relaxed text-neutral-500">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
