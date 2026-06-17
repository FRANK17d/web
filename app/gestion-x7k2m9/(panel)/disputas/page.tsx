import { AlertTriangle } from 'lucide-react'
import { ModulePending } from '@/components/ui/module-pending'

export default function DisputasPage() {
  return (
    <ModulePending
      eyebrow="Soporte"
      title="Disputas"
      description="Gestiona disputas entre clientes y técnicos."
      icon={AlertTriangle}
      note="La gestión de disputas se conectará a Insforge cuando se implemente su capa de datos."
    />
  )
}
