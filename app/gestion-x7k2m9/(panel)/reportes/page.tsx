import { ClipboardCheck } from 'lucide-react'
import { ModulePending } from '@/components/ui/module-pending'

export default function ReportesPage() {
  return (
    <ModulePending
      eyebrow="Auditoría"
      title="Reportes y registros"
      description="Registro de actividad y auditoría del sistema."
      icon={ClipboardCheck}
      note="Los reportes de auditoría se conectarán a Insforge cuando se implemente su capa de datos."
    />
  )
}
