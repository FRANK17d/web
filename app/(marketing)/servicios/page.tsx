import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, Clock3, MapPin, ShieldCheck, Sparkles, Star } from 'lucide-react'
import { services, steps } from '@/components/marketing/sections/data'

export const metadata: Metadata = {
  title: 'Servicios',
  description:
    'Explora los servicios para el hogar disponibles en toke+: electricidad, gasfiteria, albanileria, jardineria, limpieza, mudanzas y mas.',
  openGraph: {
    title: 'Servicios | toke+',
    description:
      'Encuentra tecnicos verificados para mantenimiento, reparaciones e instalaciones del hogar.',
    type: 'website',
    locale: 'es_PE',
  },
}

const highlights = [
  {
    label: 'Tecnicos verificados',
    text: 'Perfiles con experiencia, datos claros y reputacion visible.',
    icon: ShieldCheck,
  },
  {
    label: 'Respuesta cercana',
    text: 'Conectamos tu solicitud con profesionales disponibles en tu zona.',
    icon: MapPin,
  },
  {
    label: 'Proceso simple',
    text: 'Describe lo que necesitas, elige una opcion y coordina sin vueltas.',
    icon: Clock3,
  },
]

const serviceGroups = [
  {
    title: 'Reparacion y mantenimiento',
    description: 'Soluciones para urgencias, arreglos puntuales y mejoras del hogar.',
    items: ['Electricidad', 'Gasfiteria', 'Reparaciones', 'Cerrajeria'],
  },
  {
    title: 'Obra y mejoras',
    description: 'Profesionales para trabajos que transforman espacios y estructuras.',
    items: ['Albanileria', 'Carpinteria', 'Herreria', 'Aire Acondicionado'],
  },
  {
    title: 'Cuidado y apoyo del hogar',
    description: 'Servicios cotidianos para mantener tu casa lista y funcionando.',
    items: ['Jardineria', 'Limpieza', 'Mudanzas'],
  },
]

export default function ServiciosPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#FFF7F5] pt-36 pb-20 sm:pt-40 lg:pt-44 lg:pb-28">
        <div className="pointer-events-none absolute -right-24 top-24 h-[30rem] w-[30rem] rounded-full bg-[#EE7070]/15 blur-3xl" />
        <div className="pointer-events-none absolute left-0 bottom-0 h-48 w-full bg-gradient-to-t from-white to-transparent" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D94F4F]">
              Servicios toke+
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.98] tracking-tight text-neutral-900 sm:text-6xl lg:text-[82px]">
              Todo lo que tu hogar necesita
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-neutral-600 sm:text-lg">
              Desde una fuga de agua hasta una instalacion electrica, toke+ te ayuda a encontrar profesionales verificados para resolver servicios del hogar de forma rapida, clara y cercana.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#descargar"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D94F4F] px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-[#D94F4F]/20 transition-transform duration-200 hover:scale-[1.03]"
              >
                Pedir un servicio
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#categorias"
                className="inline-flex items-center justify-center rounded-full border border-[#D94F4F]/20 bg-white px-7 py-3.5 text-sm font-black text-[#D94F4F] transition-colors hover:bg-[#FFF0EE]"
              >
                Ver categorias
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-5 rounded-[2rem] bg-white/70 blur-xl" />
            <div className="relative overflow-hidden rounded-[2rem] bg-[#F28B82] p-7 shadow-[0_30px_90px_rgba(217,79,79,0.22)]">
              <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_0,white_2px,transparent_2px)] [background-size:24px_24px]" />
              <Image
                src="/mano-celular.png"
                alt="Persona solicitando servicios en toke+"
                width={800}
                height={960}
                sizes="(min-width: 1024px) 448px, 78vw"
                className="relative z-10 mx-auto h-auto w-[78%] object-contain drop-shadow-2xl"
                priority
              />
              <div className="absolute left-6 top-6 z-20 rounded-2xl bg-white px-4 py-3 shadow-lg">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#D94F4F]">Disponible</p>
                <p className="mt-1 text-sm font-bold text-neutral-700">Servicios cerca de ti</p>
              </div>
              <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-lg">
                <Star className="h-4 w-4 fill-[#D94F4F] text-[#D94F4F]" />
                <span className="text-sm font-black text-neutral-800">Confianza toke+</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-5 px-6 md:grid-cols-3 lg:px-8">
          {highlights.map((item) => (
            <div key={item.label} className="rounded-[1.5rem] border border-neutral-100 bg-neutral-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D94F4F] text-white">
                <item.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-lg font-black text-neutral-900">{item.label}</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="categorias" className="bg-neutral-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D94F4F]">
                Categorias
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-900 sm:text-5xl">
                Servicios que puedes pedir
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-neutral-600">
              La lista crece junto con la comunidad. Estas son las categorias principales que la landing ya presenta como parte de la experiencia toke+.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div key={service.name} className="group rounded-[1.35rem] border border-neutral-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#EE7070]/30 hover:shadow-xl hover:shadow-[#D94F4F]/10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0EE]">
                  <Image
                    src={service.icon}
                    alt={service.name}
                    width={48}
                    height={48}
                    sizes="40px"
                    className="h-10 w-10 object-contain transition duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="mt-5 text-base font-black text-neutral-850">{service.name}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Publica tu solicitud y conecta con profesionales disponibles para este tipo de trabajo.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-[#EE7070]/10 blur-2xl" />
            <Image
              src="/chica-tecnicos.png"
              alt="Cliente conectando con tecnicos verificados"
              width={1080}
              height={1080}
              sizes="(min-width: 1024px) 500px, calc(100vw - 3rem)"
              className="relative h-auto w-full object-contain"
            />
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D94F4F]">
              Como funciona
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-900 sm:text-5xl">
              De problema a solucion en pocos pasos
            </h2>
            <div className="mt-9 space-y-5">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-5 rounded-[1.5rem] bg-neutral-50 p-5 ring-1 ring-neutral-100">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#D94F4F] text-sm font-black text-white">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-lg font-black text-neutral-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 py-20 text-white lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#EE7070]">
              Garantia de experiencia
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
              Mas orden, menos incertidumbre
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              El valor de toke+ no es solo mostrar una lista de servicios. Es ayudarte a pedir mejor, elegir con mas informacion y coordinar con profesionales que entienden la necesidad de tu hogar.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {serviceGroups.map((group) => (
              <div key={group.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                <BadgeCheck className="h-6 w-6 text-[#EE7070]" />
                <h3 className="mt-5 text-base font-black">{group.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/60">{group.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white/75">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#D94F4F] py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/70">
              Listo para empezar
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Publica tu pedido y deja que toke+ acerque la solucion.
            </h2>
          </div>
          <Link
            href="/#descargar"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-black text-[#D94F4F] shadow-lg shadow-black/10 transition-transform duration-200 hover:scale-[1.03]"
          >
            Descargar la app
            <Sparkles className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
