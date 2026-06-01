import type { Metadata } from 'next'
import Link from 'next/link'
import { Cookie, Database, Eye, LockKeyhole, Mail, Shield, UserCheck, type LucideIcon } from 'lucide-react'
import { MarketingSubpageHero } from '@/components/marketing/page-blocks'

export const metadata: Metadata = {
  title: 'Politica de privacidad',
  description:
    'Politica base de privacidad de toke+: datos que tratamos, finalidades, seguridad y derechos de los usuarios.',
  openGraph: {
    title: 'Politica de privacidad | toke+',
    description: 'Informacion sobre el tratamiento de datos personales en toke+.',
    type: 'website',
    locale: 'es_PE',
  },
}

const dataTypes = [
  'Datos de contacto, como nombre, telefono, correo y zona de atencion.',
  'Datos de cuenta, preferencias, historial de solicitudes y comunicaciones.',
  'Informacion del servicio, como categoria, descripcion, fotos y ubicacion aproximada cuando el usuario la proporcione.',
  'Datos tecnicos basicos para seguridad, rendimiento, prevencion de fraude y mejora del producto.',
]

const purposes = [
  'Crear y administrar cuentas de clientes y profesionales.',
  'Conectar solicitudes con profesionales disponibles o relevantes.',
  'Coordinar comunicaciones relacionadas con servicios, soporte y seguridad.',
  'Mejorar la experiencia, medir calidad y prevenir usos indebidos.',
]

export default function PrivacidadPage() {
  return (
    <>
      <MarketingSubpageHero
        eyebrow="Privacidad"
        title="Politica de privacidad"
        description="Esta pagina explica, en lenguaje simple, como toke+ puede tratar datos personales para operar la plataforma. Debe validarse con asesoria legal antes de publicarse como politica definitiva."
      />

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-2 lg:px-8">
          <InfoPanel icon={Database} title="Datos que podemos recopilar" items={dataTypes} />
          <InfoPanel icon={Eye} title="Para que los usamos" items={purposes} />
        </div>
      </section>

      <section className="bg-neutral-50 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[mkt-accent] text-white">
              <Shield className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl">
              Proteccion y control
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              La privacidad forma parte de la confianza. Por eso esta pagina ordena las practicas minimas esperadas para el tratamiento de datos en toke+.
            </p>
          </div>
          <div className="grid gap-4">
            <PrivacyCard icon={LockKeyhole} title="Seguridad" text="Aplicamos medidas razonables para proteger la informacion frente a accesos no autorizados, perdida, uso indebido o alteracion." />
            <PrivacyCard icon={UserCheck} title="Derechos ARCO" text="Los usuarios pueden solicitar acceso, rectificacion, cancelacion u oposicion respecto de sus datos personales, de acuerdo con la Ley N.° 29733 de Proteccion de Datos Personales del Peru." />
            <PrivacyCard icon={Cookie} title="Cookies y tecnologia similar" text="Podemos usar cookies o tecnologias equivalentes para recordar preferencias, medir rendimiento y mejorar la navegacion." />
            <PrivacyCard icon={Mail} title="Contacto de privacidad" text="Las solicitudes relacionadas con datos personales pueden dirigirse al canal de soporte que toke+ habilite para atencion al usuario." />
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[mkt-accent]">
            Transparencia
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl">
            Los datos se usan para que el servicio funcione mejor
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
            toke+ no deberia vender datos personales. Si fuera necesario compartir informacion con profesionales, proveedores tecnologicos o autoridades, debe hacerse solo cuando sea necesario para prestar el servicio, dar soporte, cumplir obligaciones o proteger a la comunidad.
          </p>
          <Link
            href="/ayuda"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[mkt-accent] px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-[mkt-accent]/20 transition-transform duration-200 hover:scale-[1.03]"
          >
            Resolver dudas
          </Link>
        </div>
      </section>
    </>
  )
}

function InfoPanel({ icon: Icon, title, items }: { icon: LucideIcon; title: string; items: string[] }) {
  return (
    <div className="rounded-[1.75rem] border border-neutral-100 bg-neutral-50 p-7">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[mkt-accent] text-white">
        <Icon className="h-6 w-6" />
      </div>
      <h2 className="mt-6 text-2xl font-black text-neutral-900">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-7 text-neutral-600">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[mkt-accent]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function PrivacyCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="rounded-[1.35rem] bg-white p-6 shadow-sm ring-1 ring-neutral-100">
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[mkt-accent-light/10] text-[mkt-accent]">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-black text-neutral-900">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-neutral-600">{text}</p>
        </div>
      </div>
    </div>
  )
}
