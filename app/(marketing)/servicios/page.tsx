import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, Clock3, MapPin, ShieldCheck, Sparkles, Users, Zap } from 'lucide-react'
import { steps } from '@/components/marketing/sections/data'

export const metadata: Metadata = {
  title: 'Servicios para el hogar en Trujillo',
  description:
    'Explora los servicios para el hogar disponibles en toke+: técnicos verificados para mantenimiento, reparaciones, instalaciones y más en Trujillo.',
  openGraph: {
    title: 'Servicios para el hogar | toke+',
    description:
      'Encuentra técnicos verificados para mantenimiento, reparaciones e instalaciones del hogar en Trujillo.',
    type: 'website',
    locale: 'es_PE',
    url: 'https://tokeplus.app/servicios',
    images: [
      {
        url: '/ctr-redsocials.png',
        width: 1731,
        height: 909,
        alt: 'toke+ — Servicios para el hogar en Perú',
      },
    ],
  },
  alternates: {
    canonical: 'https://tokeplus.app/servicios',
  },
}

const highlights = [
  {
    label: 'Técnicos verificados',
    text: 'Perfiles con experiencia, datos claros y reputación visible antes de contratar.',
    icon: ShieldCheck,
  },
  {
    label: 'Respuesta cercana',
    text: 'Conectamos tu solicitud con profesionales disponibles en tu zona.',
    icon: MapPin,
  },
  {
    label: 'Proceso simple',
    text: 'Describe lo que necesitas, elige una opción y coordina sin vueltas.',
    icon: Clock3,
  },
]

const benefits = [
  {
    title: 'Publica tu necesidad',
    text: 'No importa el servicio. Describe qué necesitas y la app se encarga de conectar con profesionales cercanos.',
    icon: Zap,
  },
  {
    title: 'Compara y elige',
    text: 'Recibe propuestas de distintos prestadores. Revisa perfiles, calificaciones y elige con confianza.',
    icon: Users,
  },
  {
    title: 'Paga seguro al finalizar',
    text: 'El pago se libera cuando confirmas que el trabajo quedó bien. Sin sorpresas ni adelantos riesgosos.',
    icon: BadgeCheck,
  },
]

export default function ServiciosPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white pt-36 pb-20 sm:pt-40 lg:pt-44 lg:pb-28">

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-mkt-accent">
              Servicios toke+
            </p>
            <h1 className="mt-4 text-4xl font-black leading-[1] tracking-tight text-neutral-900 sm:text-5xl lg:text-[72px]">
              Todo lo que tu hogar necesita, a un toque
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-neutral-600 sm:text-lg">
              Mantenimiento, reparaciones, instalaciones y mucho más. toke+ te conecta con profesionales verificados en Trujillo para que cada problema del hogar tenga una solución rápida y confiable.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#descargar"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-mkt-accent px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-mkt-accent/20 transition-transform duration-200 hover:scale-[1.03]"
              >
                Pedir un servicio
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-7 py-3.5 text-sm font-black text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                Cómo funciona
              </a>
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-md lg:block overflow-hidden">
            {/* Fade edges to hide crop */}
            <div className="pointer-events-none absolute inset-0 z-20" style={{ background: 'linear-gradient(to right, white 0%, transparent 20%, transparent 80%, white 100%)' }} />
            <div className="pointer-events-none absolute inset-0 z-20" style={{ background: 'linear-gradient(to bottom, transparent 50%, white 95%)' }} />
            <div className="pointer-events-none absolute inset-0 z-20" style={{ background: 'linear-gradient(to top, transparent 70%, white 100%)' }} />
            <Image
              src="/mano-celular.webp"
              alt="Persona solicitando servicios en toke+"
              width={800}
              height={960}
              sizes="400px"
              className="relative z-10 mx-auto h-auto w-full object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-neutral-50 py-16 lg:py-20 border-y border-neutral-100">
        <div className="mx-auto grid max-w-7xl gap-5 px-6 md:grid-cols-3 lg:px-8">
          {highlights.map((item) => (
            <div key={item.label} className="rounded-2xl bg-white p-6 shadow-sm border border-neutral-100">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mkt-accent text-white">
                <item.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-lg font-black text-neutral-900">{item.label}</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits — what makes toke+ different */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-mkt-accent">
              Por qué toke+
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-900 sm:text-5xl">
              Más orden, menos incertidumbre
            </h2>
            <p className="mt-5 text-base leading-7 text-neutral-600">
              El valor de toke+ no es solo mostrar una lista de servicios. Es ayudarte a pedir mejor, elegir con más información y coordinar con profesionales que entienden la necesidad de tu hogar.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {benefits.map((item) => (
              <div key={item.title} className="hover-lift rounded-2xl border border-neutral-100 bg-neutral-50 p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mkt-accent text-white">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-black text-neutral-800">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — steps */}
      <section id="como-funciona" className="bg-neutral-50 py-20 lg:py-28 border-t border-neutral-100">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-mkt-accent">
              Cómo funciona
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-900 sm:text-5xl">
              De problema a solución en minutos
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-neutral-600">
              No importa si es una urgencia o un proyecto planificado. En tres pasos simples, ya tienes un profesional en camino.
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.number} className="hover-lift flex gap-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-100">
                <span className="number-pop flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mkt-accent text-sm font-black text-white">
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
      </section>

      {/* CTA band */}
      <section className="bg-mkt-accent py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/70">
              Listo para empezar
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Publica tu pedido y deja que toke+ acerque la solución.
            </h2>
          </div>
          <Link
            href="/#descargar"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-black text-mkt-accent shadow-lg shadow-black/10 transition-transform duration-200 hover:scale-[1.03]"
          >
            Descargar la app
            <Sparkles className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
