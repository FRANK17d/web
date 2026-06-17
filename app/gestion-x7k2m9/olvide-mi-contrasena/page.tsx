import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PasswordRecoveryForm } from './password-recovery-form'
import { getAdminSession } from '@/lib/admin-auth/server'

export const dynamic = 'force-dynamic'

export default async function AdminForgotPasswordPage() {
  const admin = await getAdminSession()

  if (admin) {
    redirect('/gestion-x7k2m9')
  }

  return (
    <main id="main-content" className="flex min-h-[100dvh] items-center bg-white px-3 py-4 sm:px-6 sm:py-8">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 h-[400px] w-[400px] rounded-full bg-[#EE7070]/[0.05] blur-[120px]" />
      </div>

      <div className="relative mx-auto w-full max-w-lg">
        <div className="mb-6 flex items-center justify-center sm:mb-8">
          <Image
            src="/toke-logo.svg"
            alt="toke+"
            width={110}
            height={42}
            style={{ width: 110, height: 'auto' }}
            priority
          />
        </div>

        <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-5 text-center sm:mb-8">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#EE7070]">
              Recuperación
            </p>
            <h1 className="mt-2 text-xl font-extrabold tracking-tight text-neutral-800 sm:mt-3 sm:text-3xl">
              Olvidé mi contraseña
            </h1>
            <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-neutral-500 sm:text-sm sm:leading-6">
              Recupera el acceso a tu cuenta administrativa.
            </p>
          </div>

          <PasswordRecoveryForm />

          <div className="mt-6 text-center sm:mt-8">
            <Link
              href="/gestion-x7k2m9/iniciar-sesion"
              className="text-sm font-medium text-[#EE7070] transition-colors hover:text-[#D94F4F] hover:underline"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
