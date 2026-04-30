import Image from 'next/image'
import { providers, statServiceIcons } from './data'

export function StatsSection() {
  return (
    <>
      {/* Banner */}
      <section className="relative bg-gradient-to-br from-[#EE7070] to-[#D94F4F] py-16 lg:py-20 overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="text-2xl font-extrabold italic text-white sm:text-3xl lg:text-4xl tracking-tight leading-snug">
            «Conectar personas con soluciones reales»
          </p>
        </div>
      </section>

      {/* Stat Cards */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2">
            {/* Card 1 — Providers */}
            <div className="group relative overflow-hidden rounded-3xl bg-neutral-50 p-8 sm:p-10 border border-neutral-100 shadow-sm transition-all duration-300 hover:shadow-lg">
              <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#EE7070]/5" />
              <div className="relative flex items-center gap-3 mb-8">
                {providers.map((person, i) => (
                  <div key={person.name} className="flex flex-col items-center gap-1" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className={`flex h-11 w-11 items-center justify-center rounded-full ${person.bg} text-lg shadow-sm ring-2 ring-white`}>{person.emoji}</div>
                    <span className="text-[10px] font-semibold text-neutral-600 whitespace-nowrap">{person.name}</span>
                    <span className="text-[9px] text-neutral-400">{person.role}</span>
                  </div>
                ))}
              </div>
              <p className="text-5xl font-black text-[#EE7070] sm:text-6xl tracking-tight">+2,523</p>
              <p className="mt-2 text-base font-semibold text-neutral-600">Prestadores de servicios</p>
            </div>

            {/* Card 2 — Orders */}
            <div className="group relative overflow-hidden rounded-3xl bg-neutral-50 p-8 sm:p-10 border border-neutral-100 shadow-sm transition-all duration-300 hover:shadow-lg">
              <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#EE7070]/5" />
              <div className="relative flex items-end gap-2 mb-8">
                {statServiceIcons.map((svc, i) => (
                  <div key={svc.label} className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md border border-neutral-100 transition-transform duration-300 group-hover:scale-105" style={{ transform: `rotate(${-6 + i * 4}deg)`, animationDelay: `${i * 80}ms` }}>
                    <Image src={svc.icon} alt={svc.label} width={36} height={36} className="h-9 w-9 object-contain" />
                  </div>
                ))}
              </div>
              <p className="text-5xl font-black text-[#EE7070] sm:text-6xl tracking-tight">+2,844</p>
              <p className="mt-2 text-base font-semibold text-neutral-600">Pedidos realizados</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
