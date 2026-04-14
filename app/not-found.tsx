import Link from 'next/link'
import { Logo } from '@/components/logo'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-50 antialiased">
      <div className="flex flex-1 items-center justify-center p-6">
        {/* Tarjeta Limpia y Estructurada */}
        <div className="w-full max-w-lg bg-white rounded-2xl border border-surface-200 shadow-sm p-10 sm:p-14">
          <div className="flex flex-col items-start text-left">
            
            {/* Logo minimalista */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-100 border border-surface-200 mb-8">
              <Logo className="h-6 w-6 text-brand-600" />
            </div>

            {/* Tipografía precisa y profesional */}
            <h1 className="text-[28px] font-semibold tracking-tight text-surface-900 leading-tight">
              Página no encontrada
            </h1>
            
            {/* Texto funcional institucional */}
            <p className="mt-4 text-[15px] text-surface-500 leading-relaxed">
              La ruta solicitada no existe en el sistema. Asegúrate de que la dirección web sea correcta o que tengas los permisos correspondientes.
            </p>

            {/* Botón sobrio */}
            <div className="mt-10 flex w-full">
              <Link 
                href="/" 
                className="inline-flex items-center justify-center px-6 py-2.5 text-[15px] font-medium text-white bg-surface-900 rounded-xl hover:bg-surface-800 transition-colors shadow-sm"
              >
                Volver a la plataforma
              </Link>
            </div>
            
            {/* Detalles técnicos en el pie de la tarjeta */}
            <div className="mt-12 flex items-center justify-between w-full border-t border-surface-100 pt-6">
               <span className="text-sm font-medium text-surface-400 tracking-wide">ERROR 404</span>
               <span className="text-sm text-surface-400">MaestroYa</span>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
