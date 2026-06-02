import type { Metadata } from 'next'
import Link from 'next/link'
import { Binoculars, Handshake, ShieldCheck, Sparkles, Target, UsersRound, type LucideIcon } from 'lucide-react'
import { TokeLogo } from '@/components/marketing/toke-logo'
import { TeamSection } from '@/components/marketing/team-section'

export const metadata: Metadata = {
  title: 'Nosotros — Equipo detrás de toke+',
  description:
    'Conoce la visión de toke+: conectar hogares con profesionales verificados para resolver servicios del hogar de forma simple, segura y cercana en Trujillo.',
  openGraph: {
    title: 'Nosotros | toke+',
    description:
      'Conectamos hogares con técnicos verificados para que cada arreglo, instalación o mantenimiento esté a un toque de distancia.',
    type: 'website',
    locale: 'es_PE',
    url: 'https://tokeplus.app/nosotros',
  },
  alternates: {
    canonical: 'https://tokeplus.app/nosotros',
  },
}

const principles = [
  {
    title: 'Confianza verificable',
    text: 'Cuidamos que cada conexión entre hogar y profesional parta de información clara, reputación visible y procesos que reduzcan la incertidumbre.',
    icon: ShieldCheck,
  },
  {
    title: 'Trabajo con oportunidad',
    text: 'Queremos que los técnicos puedan mostrar su experiencia, recibir más solicitudes y construir relaciones laborales más estables.',
    icon: Handshake,
  },
  {
    title: 'Tecnología cercana',
    text: 'Diseñamos una app simple para resolver necesidades reales: encontrar ayuda, comparar opciones y pedir un servicio sin vueltas.',
    icon: Sparkles,
  },
]

const values = [
  'Honestidad en cada solicitud, precio y comunicación.',
  'Respeto por el tiempo del cliente y del profesional.',
  'Responsabilidad ante cada servicio coordinado.',
  'Mejora constante escuchando a la comunidad.',
]

export default function NosotrosPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-white pt-36 pb-20 sm:pt-40 lg:pt-44 lg:pb-28">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-mkt-accent-light/10 to-white" />
        <div className="pointer-events-none absolute right-0 top-24 h-[20rem] w-[20rem] sm:h-[28rem] sm:w-[28rem] translate-x-1/3 sm:translate-x-1/2 rounded-full bg-mkt-accent-light/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-mkt-accent">
              La empresa
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tight text-neutral-900 sm:text-6xl sm:whitespace-nowrap lg:text-[88px]">
              Sobre nosotros
            </h1>
            <div className="mt-8 max-w-2xl space-y-5 text-[15px] leading-7 text-neutral-600 sm:text-base">
              <p className="text-2xl font-extrabold leading-tight text-neutral-800 sm:text-3xl">
                toke+ nace para que encontrar ayuda confiable en casa sea tan simple como pedirla.
              </p>
              <p>
                Somos una plataforma creada en Trujillo para conectar hogares con profesionales de mantenimiento, reparación e instalación. Sabemos que una urgencia en casa no puede depender de contactos al azar, respuestas tardías o información incompleta.
              </p>
              <p>
                Por eso construimos una experiencia que acerca técnicos verificados, categorías claras y una forma más ordenada de solicitar servicios. Queremos que cada persona pueda resolver lo cotidiano con tranquilidad, y que cada profesional tenga una vitrina digna para crecer.
              </p>
              <p>
                Nuestro camino empieza con servicios para el hogar, pero nuestra ambición es más grande: convertir a toke+ en una red de confianza donde las soluciones correctas lleguen a las personas correctas, justo cuando se necesitan.
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:mt-32">
            <div className="rounded-[1.5rem] bg-white p-14 sm:p-16 shadow-lg shadow-neutral-900/5 border border-neutral-200/60">
              <div className="flex items-center justify-center">
                <TokeLogo size="xl" variant="color" className="h-20 sm:h-24 lg:h-28 w-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-10">
            <InfoBlock
              icon={Target}
              title="Misión"
              text="Conectar personas con técnicos confiables para resolver necesidades del hogar con rapidez, seguridad y transparencia, mientras impulsamos mejores oportunidades para profesionales independientes."
            />
            <InfoBlock
              icon={Binoculars}
              title="Visión"
              text="Ser la plataforma de referencia para servicios del hogar en Trujillo y La Libertad, fortaleciendo una comunidad donde la tecnología simplifica la confianza y el trabajo bien hecho se vuelve más visible."
            />
          </div>

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mkt-accent text-white">
                <UsersRound className="h-5 w-5" />
              </div>
              <h2 className="text-3xl font-black text-neutral-800">Valores</h2>
            </div>
            <div className="mt-7 grid gap-4">
              {values.map((value, index) => (
                <div key={value} className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200/70">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mkt-accent-light/10 text-sm font-black text-mkt-accent">
                    {index + 1}
                  </span>
                  <p className="text-sm font-medium leading-6 text-neutral-600">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-mkt-accent">
              Cómo trabajamos
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl">
              Una red pensada para resolver con claridad
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {principles.map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-neutral-100 bg-neutral-50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-mkt-accent-light/25 hover:bg-white hover:shadow-xl hover:shadow-mkt-accent/10">
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

      <TeamSection />

      <section className="bg-mkt-accent py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/70">
              El siguiente paso
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Tu hogar no debería esperar por una solución.
            </h2>
          </div>
          <Link
            href="/#descargar"
            className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-black text-mkt-accent shadow-lg shadow-black/10 transition-transform duration-200 hover:scale-[1.03]"
          >
            Descargar la app
          </Link>
        </div>
      </section>
    </>
  )
}

function InfoBlock({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon
  title: string
  text: string
}) {
  return (
    <div className="flex gap-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-mkt-accent text-white">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h2 className="text-3xl font-black text-neutral-800">{title}</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-600 sm:text-[15px]">{text}</p>
      </div>
    </div>
  )
}
