'use client'

import Image from 'next/image'
import { type PointerEvent } from 'react'

const team = [
  {
    name: 'Edgar Insfran',
    role: 'CEO',
    detail: 'Estrategia, gestión de proyectos y crecimiento.',
    image: '/edgar-insfran.webp',
  },
  {
    name: 'Edgar Cabral',
    role: 'CTO',
    detail: 'Tecnología, análisis y diseño integral de software.',
    image: '/edgar-cabral.webp',
  },
  {
    name: 'Equipo Producto',
    role: 'UX & Operaciones',
    detail: 'Experiencia del usuario y mejora continua del servicio.',
    image: '/edgar-insfran.webp',
  },
  {
    name: 'Equipo Plataforma',
    role: 'Desarrollo',
    detail: 'Arquitectura, calidad y estabilidad de la aplicación.',
    image: '/edgar-cabral.webp',
  },
]

function updateCursorPosition(event: PointerEvent<HTMLDivElement>) {
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty('--team-cursor-x', `${event.clientX - rect.left}px`)
  event.currentTarget.style.setProperty('--team-cursor-y', `${event.clientY - rect.top}px`)
}

export function TeamSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-neutral-100" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-mkt-accent-light/[0.06] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-mkt-accent">
            El equipo
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl">
            Personas detrás de toke+
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
            Un gran proyecto necesita un gran equipo. Desde la estrategia hasta la tecnología, cada rol aporta su talento para que pedir ayuda en casa sea más simple, seguro y rápido.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, index) => (
            <article key={`${member.name}-${index}`} className="text-center">
              <div
                className="group/team relative mx-auto h-[310px] max-w-[230px] cursor-none overflow-hidden rounded-[1.75rem] motion-reduce:cursor-auto"
                onPointerEnter={updateCursorPosition}
                onPointerMove={updateCursorPosition}
              >
                <div className="absolute inset-x-6 bottom-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent z-20" />
                <Image
                  src={member.image}
                  alt={member.name}
                  width={402}
                  height={679}
                  sizes="230px"
                  className="relative z-10 h-full w-full object-contain object-bottom transition duration-500 group-hover/team:scale-[1.04]"
                />
                <div className="absolute inset-0 z-30 rounded-[1.75rem]" />
                <div
                  className="pointer-events-none absolute z-40 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 scale-90 items-center justify-center rounded-full bg-mkt-accent text-center text-[10px] font-black uppercase tracking-[0.14em] text-white opacity-0 shadow-2xl shadow-mkt-accent/30 transition-[opacity,transform] duration-75 group-hover/team:scale-100 group-hover/team:opacity-100 motion-reduce:hidden"
                  style={{
                    left: 'var(--team-cursor-x, 50%)',
                    top: 'var(--team-cursor-y, 50%)',
                  }}
                >
                  toke+
                </div>
              </div>

              <h3 className="mt-6 text-xl font-black text-neutral-800">{member.name}</h3>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-mkt-accent">
                {member.role}
              </p>
              <p className="mx-auto mt-3 max-w-[15rem] text-sm leading-6 text-neutral-500">
                {member.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
