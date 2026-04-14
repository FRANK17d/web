import { redirect } from 'next/navigation'
import Image from 'next/image'
import { Suspense } from 'react'
import { LoginForm } from './login-form'
import { Logo } from '@/components/logo'
import { getAdminSession } from '@/lib/admin-auth/server'

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage() {
  const admin = await getAdminSession()

  if (admin) {
    redirect('/administracion')
  }

  return (
    <main id="main-content" className="flex min-h-screen bg-white">
      {/* Left Panel - Brand with Image */}
      <div className="relative hidden w-[45%] flex-col justify-between bg-brand-900 lg:flex overflow-hidden">
        {/* Optimized Background Image */}
        <Image 
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop"
          alt="Profesional de Arquitectura y Servicios"
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-25"
        />
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-900/60 to-brand-900/40" />
        
        <div className="relative z-10 flex items-center gap-3 px-12 py-16 animate-fade-in">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 shadow-sm">
            <Logo className="h-6 w-6 text-white" aria-hidden="true" focusable="false" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white drop-shadow-sm">
            MaestroYa
          </span>
        </div>

        <div className="relative z-10 px-12 pb-32 pt-10 animate-slide-up mb-18" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
          <div className="mb-6">
            <span className="inline-block rounded bg-brand-800/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-100 backdrop-blur-md border border-brand-700/50">
              Administración
            </span>
          </div>
          <p className="text-3xl font-medium tracking-tight text-white md:text-4xl text-balance leading-tight drop-shadow-md">
            Gestión centralizada para la red de especialistas
          </p>
          <p className="mt-6 max-w-md text-base text-brand-100/90 leading-relaxed font-light drop-shadow-sm">
            Supervisa perfiles, monitorea interacciones y asegura la calidad del servicio en la plataforma principal. Acceso exclusivo para personal operativo.
          </p>
        </div>

        <div className="relative z-10 px-12 py-4 animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
          <p className="text-sm text-brand-300/70">
            © {new Date().getFullYear()} MaestroYa Inc. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full flex-col bg-white px-3 py-6 sm:px-6 sm:py-12 lg:w-[55%] animate-fade-in">
        
        {/* Mobile Header - Posicionado arriba */}
        <div className="flex items-center justify-center gap-3 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 shadow-sm sm:h-10 sm:w-10">
            <Logo className="h-6 w-6 text-white" aria-hidden="true" focusable="false" />
          </div>
          <span className="text-lg font-bold tracking-tight text-surface-900 sm:text-xl">
            MaestroYa
          </span>
        </div>

        {/* Contenedor del formulario - Centrado en el espacio restante */}
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          <div className="mb-5 mt-6 text-center lg:mt-0 lg:text-left sm:mb-8">
            <h1 className="text-lg font-semibold tracking-tight text-surface-900 sm:text-2xl">Iniciar sesión</h1>
            <p className="mt-1.5 text-xs text-surface-500 sm:mt-2 sm:text-sm">
              Ingresa tus credenciales para iniciar sesión.
            </p>
          </div>

          <Suspense fallback={<div className="h-[240px] w-full animate-pulse rounded-xl bg-surface-50 sm:h-[280px]" />}>
            <LoginForm />
          </Suspense>
        </div>
        
      </div>
    </main>
  )
}
