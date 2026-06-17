import { notFound } from 'next/navigation'

const sectionContent = {
  usuarios: {
    title: 'Usuarios',
    description: 'Aqui conectaremos la gestion de clientes, tecnicos y administradores con Insforge.',
  },
  verificaciones: {
    title: 'Verificaciones',
    description: 'Esta seccion procesara documentos y estados de aprobacion desde Insforge.',
  },
  reservas: {
    title: 'Reservas',
    description: 'Aqui se mostrara la operacion de reservas cuando el modulo de datos quede conectado.',
  },
  servicios: {
    title: 'Servicios',
    description: 'Aqui administraremos el catalogo de servicios con datos de Insforge.',
  },
  disputas: {
    title: 'Disputas',
    description: 'Esta seccion centralizara reclamos y resoluciones abiertas del sistema.',
  },
  reportes: {
    title: 'Reportes',
    description: 'Aqui iran metricas y cortes operativos consumidos desde Insforge.',
  },
  configuracion: {
    title: 'Configuracion',
    description: 'Aqui viviran los ajustes administrativos del panel y sus reglas.',
  },
} as const

type AdminSection = keyof typeof sectionContent

export default async function AdministracionSectionPage({
  params,
}: {
  params: Promise<{ section: string }>
}) {
  const { section } = await params

  if (!(section in sectionContent)) {
    notFound()
  }

  const content = sectionContent[section as AdminSection]

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">{content.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-surface-500">{content.description}</p>
      </div>

      <div className="card">
        <div className="rounded-2xl border border-dashed border-surface-300 bg-surface-50 px-6 py-12 text-center">
          <p className="text-sm font-medium text-surface-700">Modulo en preparacion</p>
          <p className="mt-2 text-sm text-surface-500">
            La autenticacion admin ya esta integrada con Insforge. Esta vista queda lista para conectar su capa de datos.
          </p>
        </div>
      </div>
    </div>
  )
}
