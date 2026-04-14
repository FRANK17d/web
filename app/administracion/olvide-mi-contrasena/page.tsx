import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PasswordRecoveryForm } from './password-recovery-form'
import { Logo } from '@/components/logo'
import { getAdminSession } from '@/lib/admin-auth/server'

export const dynamic = 'force-dynamic'

export default async function AdminForgotPasswordPage() {
  const admin = await getAdminSession()

  if (admin) {
    redirect('/administracion')
  }

  return (
    <main id="main-content" className="min-h-screen bg-surface-100 px-3 py-6 sm:px-6 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-lg flex-col justify-center">
        <div className="mb-6 flex items-center justify-center gap-3 animate-fade-in sm:mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 shadow-sm sm:h-10 sm:w-10">
            <Logo className="h-6 w-6 text-white" aria-hidden="true" focusable="false" />
          </div>
          <span className="text-lg font-bold tracking-tight text-surface-900 sm:text-xl">MaestroYa</span>
        </div>

        <div className="rounded-[28px] border border-surface-200 bg-white p-4 shadow-sm sm:rounded-[32px] sm:p-7 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          <div className="mb-5 text-center sm:mb-8">
            <h1 className="mt-2 text-xl font-semibold tracking-tight text-surface-900 sm:mt-3 sm:text-3xl">
              Olvide mi contraseña
            </h1>
            <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-surface-500 sm:text-sm sm:leading-6">
              Recupera tu acceso a tu cuenta administrativa.
            </p>
          </div>

          <PasswordRecoveryForm />

          <div className="mt-6 text-center sm:mt-8">
            <Link href="/administracion/iniciar-sesion" className="text-xs font-medium text-brand-600 transition-colors hover:text-brand-800 hover:underline sm:text-sm">
              Volver al inicio de sesion
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
