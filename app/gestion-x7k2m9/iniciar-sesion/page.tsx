import { redirect } from 'next/navigation'
import Image from 'next/image'
import { Suspense } from 'react'
import { LoginForm } from './login-form'
import { getAdminSession } from '@/lib/admin-auth/server'

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage() {
  const admin = await getAdminSession()

  if (admin) {
    redirect('/gestion-x7k2m9')
  }

  return (
    <main id="main-content" className="flex min-h-screen">
      {/* Left Panel — toke+ brand */}
      <div className="relative hidden w-[48%] flex-col justify-between lg:flex overflow-hidden bg-gradient-to-br from-[#EE7070] to-[#D94F4F]">
        {/* Wavy pattern */}
        <div
          className="absolute inset-y-0 -inset-x-[120px] opacity-[0.10]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='20' viewBox='0 0 120 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q 30 0, 60 10 T 120 10' fill='none' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
            backgroundSize: '120px 20px',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Decorative blurs */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

        {/* Logo top */}
        <div className="relative z-10 px-12 py-14">
          <Image
            src="/toke-logo.svg"
            alt="toke+"
            width={120}
            height={46}
            style={{ width: 120, height: 'auto' }}
            className="brightness-0 invert"
            priority
          />
        </div>

        {/* Hero copy */}
        <div className="relative z-10 px-12 pb-28 pt-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
            Administración
          </p>
          <p className="mt-5 text-3xl font-extrabold tracking-tight text-white md:text-[2.4rem] leading-[1.15]">
            Gestión centralizada
            <br />
            para la red de
            <br />
            especialistas
          </p>
          <p className="mt-6 max-w-sm text-[15px] text-white/75 leading-relaxed">
            Supervisa perfiles, monitorea interacciones y asegura la calidad del
            servicio. Acceso exclusivo para personal operativo.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 border-t border-white/15 px-12 py-5">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} toke+ — Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Right Panel — White, centered form */}
      <div className="flex w-full flex-col bg-white px-6 py-8 sm:px-10 sm:py-14 lg:w-[52%]">
        {/* Mobile header */}
        <div className="flex items-center gap-3 lg:hidden mb-8">
          <Image
            src="/toke-logo.svg"
            alt="toke+"
            width={100}
            height={38}
            style={{ width: 100, height: 'auto' }}
            priority
          />
        </div>

        {/* Form container */}
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
          {/* Form header */}
          <div className="mb-8 lg:text-left text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-neutral-800">
              Iniciar sesión
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Ingresa tus credenciales para continuar.
            </p>
          </div>

          {/* Card wrapping the form */}
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-neutral-100">
            <Suspense
              fallback={
                <div className="h-[240px] w-full animate-pulse rounded-2xl bg-neutral-50" />
              }
            >
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}
