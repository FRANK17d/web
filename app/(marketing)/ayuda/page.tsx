import type { Metadata } from 'next'
import Link from 'next/link'
import { CircleHelp, ClipboardList, Mail, MessageCircle, ShieldCheck, Smartphone, UserRound, Wrench } from 'lucide-react'
import { MarketingCtaBand, MarketingSubpageHero } from '@/components/marketing/page-blocks'

export const metadata: Metadata = {
  title: 'Centro de ayuda',
  description:
    'Preguntas frecuentes de toke+ para clientes y profesionales: solicitudes, servicios, seguridad, cuenta y soporte.',
  openGraph: {
    title: 'Centro de ayuda | toke+',
    description: 'Preguntas frecuentes y soporte para usar toke+.',
    type: 'website',
    locale: 'es_PE',
  },
}

const faqGroups = [
  {
    title: 'Para clientes',
    icon: UserRound,
    questions: [
      {
        q: 'Como pido un servicio?',
        a: 'Elige la categoria, describe lo que necesitas y agrega detalles como zona, horario o fotos. Con esa informacion, toke+ puede acercarte profesionales relacionados con tu solicitud.',
      },
      {
        q: 'Puedo elegir al tecnico?',
        a: 'La idea de toke+ es que puedas revisar opciones, comparar perfiles y coordinar con el profesional que mejor se ajuste a tu necesidad.',
      },
      {
        q: 'Que hago si mi problema es urgente?',
        a: 'Describe la urgencia desde el inicio y selecciona la categoria correcta. Mientras mas claro sea el pedido, mas facil sera recibir una respuesta adecuada.',
      },
    ],
  },
  {
    title: 'Para profesionales',
    icon: Wrench,
    questions: [
      {
        q: 'Como recibo pedidos?',
        a: 'Los pedidos se relacionan con tu zona, categorias y disponibilidad. Mantener tu perfil completo ayuda a que los clientes entiendan mejor tu experiencia.',
      },
      {
        q: 'Que datos debo mostrar?',
        a: 'Datos de contacto, zonas de atencion, especialidades y referencias del trabajo que realizas. La informacion debe ser real y estar actualizada.',
      },
      {
        q: 'Puedo rechazar un pedido?',
        a: 'Si un pedido no coincide con tu disponibilidad o especialidad, puedes no tomarlo. Lo importante es comunicar con claridad y respeto.',
      },
    ],
  },
  {
    title: 'Cuenta y seguridad',
    icon: ShieldCheck,
    questions: [
      {
        q: 'Como protege toke+ a la comunidad?',
        a: 'La plataforma puede revisar perfiles, reportes y actividad para prevenir fraudes, mejorar la calidad del servicio y cuidar la confianza entre usuarios.',
      },
      {
        q: 'Que hago si tengo un problema con un servicio?',
        a: 'Reune la informacion del pedido, fotos si corresponde y el detalle de lo ocurrido. Con esos datos, el soporte podra orientarte mejor.',
      },
      {
        q: 'Como cambio mis datos?',
        a: 'Cuando la cuenta este habilitada, podras actualizar informacion desde tu perfil o solicitar ayuda al canal de soporte.',
      },
    ],
  },
]

const quickActions = [
  {
    title: 'Pedir un servicio',
    text: 'Explora las categorias disponibles y encuentra ayuda para tu hogar.',
    href: '/servicios',
    icon: ClipboardList,
  },
  {
    title: 'Descargar la app',
    text: 'Empieza desde el acceso principal de descarga.',
    href: '/#descargar',
    icon: Smartphone,
  },
  {
    title: 'Hablar con soporte',
    text: 'Usa el canal de contacto que toke+ habilite para atencion.',
    href: 'mailto:soporte@toke.app',
    icon: Mail,
  },
]

export default function AyudaPage() {
  return (
    <>
      <MarketingSubpageHero
        eyebrow="Soporte"
        title="Centro de ayuda"
        description="Respuestas rapidas para clientes y profesionales que usan toke+ para coordinar servicios del hogar."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-5 px-6 md:grid-cols-3 lg:px-8">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group rounded-[1.5rem] border border-neutral-100 bg-neutral-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#EE7070]/30 hover:bg-white hover:shadow-xl hover:shadow-[#D94F4F]/10"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D94F4F] text-white">
                <action.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-lg font-black text-neutral-900">{action.title}</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{action.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-neutral-50 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D94F4F] text-white">
              <CircleHelp className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl">
              Preguntas frecuentes
            </h2>
          </div>

          <div className="space-y-8">
            {faqGroups.map((group) => (
              <div key={group.title} className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-neutral-100 sm:p-7">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0EE] text-[#D94F4F]">
                    <group.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-black text-neutral-900">{group.title}</h3>
                </div>
                <div className="divide-y divide-neutral-100">
                  {group.questions.map((item) => (
                    <details key={item.q} className="group py-4">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-base font-black text-neutral-800">
                        {item.q}
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[#D94F4F] transition group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MarketingCtaBand
        eyebrow="Contacto"
        title="Si no encuentras la respuesta, escribenos."
      >
        <a
          href="mailto:soporte@toke.app"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-black text-[#D94F4F] shadow-lg shadow-black/10 transition-transform duration-200 hover:scale-[1.03]"
        >
          <MessageCircle className="h-4 w-4" />
          Contactar soporte
        </a>
      </MarketingCtaBand>
    </>
  )
}
