import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { getAdminSession } from '@/lib/admin-auth/server'

const cards = [
  { label: 'Usuarios', value: 'Pendiente API', icon: Users, color: 'text-brand-600 bg-brand-50' },
  { label: 'Reservas', value: 'Pendiente API', icon: CalendarDays, color: 'text-warning-500 bg-warning-50' },
  { label: 'Verificaciones', value: 'Pendiente API', icon: ShieldCheck, color: 'text-success-500 bg-success-50' },
  { label: 'Reportes', value: 'Pendiente API', icon: BarChart3, color: 'text-brand-700 bg-brand-100' },
]

export default async function AdministracionPage() {
  const admin = await getAdminSession()

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">
          Bienvenido, {admin?.nombreCompleto.split(' ')[0] ?? 'Administrador'}
        </h1>
        <p className="mt-1 text-sm text-surface-500">
          El acceso ya esta pasando por Express. Los modulos del panel se conectaran a endpoints dedicados del backend.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="card group transition-all duration-200 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-surface-500">{card.label}</p>
                <p className="mt-2 text-lg font-bold text-surface-900">{card.value}</p>
              </div>
              <div className={`rounded-xl p-3 ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="text-lg font-semibold text-surface-900">Estado del panel</h2>
          <p className="mt-2 text-sm text-surface-500">
            La sesion administrativa ya usa cookies seguras y validacion en backend. El siguiente bloque es conectar usuarios, verificaciones, reservas y disputas a sus endpoints.
          </p>
          <div className="mt-6 rounded-2xl border border-dashed border-surface-300 bg-surface-50 px-6 py-10 text-center">
            <p className="text-sm font-medium text-surface-700">Autenticacion admin activa</p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-surface-900">Siguiente hito</h2>
          <p className="mt-2 text-sm text-surface-500">
            Recomiendo seguir con `usuarios` y `verificaciones`, porque ambas pantallas ya son coherentes con el flujo de administrador autenticado.
          </p>
          <div className="mt-6 flex items-center justify-center rounded-2xl border border-dashed border-surface-300 bg-surface-50 px-6 py-10 text-center">
            <div className="flex items-center gap-2 text-sm text-surface-500">
              <AlertTriangle className="h-4 w-4 text-warning-500" />
              KPIs reales aun no expuestos por el backend
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
