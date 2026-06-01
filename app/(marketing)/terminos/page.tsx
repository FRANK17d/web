import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertCircle, BadgeCheck, FileText, Handshake, Scale, ShieldCheck } from 'lucide-react'
import { MarketingCtaBand, MarketingSubpageHero } from '@/components/marketing/page-blocks'

export const metadata: Metadata = {
  title: 'Terminos y condiciones',
  description:
    'Terminos base de uso de toke+: condiciones generales para clientes, profesionales y visitantes de la plataforma.',
  openGraph: {
    title: 'Terminos y condiciones | toke+',
    description: 'Condiciones generales de uso de la plataforma toke+.',
    type: 'website',
    locale: 'es_PE',
  },
}

const terms = [
  {
    title: 'Uso de la plataforma',
    icon: FileText,
    text: 'toke+ permite que clientes soliciten servicios del hogar y que profesionales puedan recibir oportunidades de trabajo segun disponibilidad, categoria y zona de atencion.',
  },
  {
    title: 'Usuarios y responsabilidades',
    icon: Handshake,
    text: 'Cada usuario debe brindar informacion real, mantener actualizados sus datos y usar la plataforma de forma respetuosa, licita y coherente con el servicio solicitado.',
  },
  {
    title: 'Profesionales de servicio',
    icon: BadgeCheck,
    text: 'Los profesionales son responsables de la calidad, puntualidad, presupuesto y ejecucion del trabajo que acuerden con el cliente, sin perjuicio de los controles y procesos internos de toke+.',
  },
  {
    title: 'Seguridad y confianza',
    icon: ShieldCheck,
    text: 'Podemos revisar perfiles, reportes, solicitudes y conductas para proteger a la comunidad, prevenir fraudes y mejorar la experiencia de clientes y profesionales.',
  },
]

export default function TerminosPage() {
  return (
    <>
      <MarketingSubpageHero
        eyebrow="Legal"
        title="Terminos y condiciones"
        description="Estas condiciones describen las reglas base para usar toke+. El texto debe validarse con asesoria legal antes de publicarse como contrato definitivo."
      />

      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-5 px-6 md:grid-cols-2 lg:px-8">
          {terms.map((item) => (
            <article key={item.title} className="rounded-[1.5rem] border border-neutral-100 bg-neutral-50 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[mkt-accent] text-white">
                <item.icon className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-xl font-black text-neutral-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-neutral-50 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[mkt-accent] text-white">
              <Scale className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl">
              Condiciones principales
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Estas reglas buscan mantener una experiencia clara para ambas partes: quien solicita un servicio y quien lo realiza.
            </p>
          </div>
          <div className="space-y-4">
            <PolicyRow title="Solicitudes y presupuestos" text="El cliente debe describir su necesidad con la mayor claridad posible. Todo presupuesto, alcance, horario y condicion del servicio debe quedar coordinado entre las partes." />
            <PolicyRow title="Pagos y cancelaciones" text="Cuando la plataforma habilite pagos o reservas, las reglas especificas de cobro, reembolso o cancelacion se informaran antes de confirmar la operacion." />
            <PolicyRow title="Contenido y comunicaciones" text="No se permite publicar contenido falso, discriminatorio, ofensivo, fraudulento o que afecte la seguridad de otros usuarios." />
            <PolicyRow title="Cambios en los terminos" text="toke+ puede actualizar estas condiciones para reflejar cambios del servicio, mejoras operativas o exigencias normativas." />
          </div>
        </div>
      </section>

      <MarketingCtaBand
        eyebrow="Dudas"
        title="Si algo no queda claro, revisa el centro de ayuda."
      >
        <Link
          href="/ayuda"
          className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-black text-[mkt-accent] shadow-lg shadow-black/10 transition-transform duration-200 hover:scale-[1.03]"
        >
          Ir a ayuda
        </Link>
      </MarketingCtaBand>
    </>
  )
}

function PolicyRow({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.35rem] bg-white p-6 shadow-sm ring-1 ring-neutral-100">
      <div className="flex items-start gap-4">
        <AlertCircle className="mt-1 h-5 w-5 shrink-0 text-[mkt-accent]" />
        <div>
          <h3 className="text-base font-black text-neutral-900">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-neutral-600">{text}</p>
        </div>
      </div>
    </div>
  )
}
