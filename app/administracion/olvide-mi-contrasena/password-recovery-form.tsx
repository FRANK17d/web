'use client'

import type { FormEvent } from 'react'
import { useEffect, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react'
import { callAdminApi } from '@/lib/admin-auth/browser'

type Step = 'request' | 'verify' | 'reset' | 'done'
type InputMode = 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'

export function PasswordRecoveryForm() {
  const [step, setStep] = useState<Step>('request')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const codeInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (step === 'request') {
      emailInputRef.current?.focus()
      return
    }

    if (step === 'verify') {
      codeInputRef.current?.focus()
      return
    }

    if (step === 'reset') {
      passwordInputRef.current?.focus()
    }
  }, [step])

  function clearFeedback() {
    setError(null)
    setMessage(null)
  }

  function resetFlow() {
    clearFeedback()
    setEmail('')
    setCode('')
    setResetToken('')
    setNewPassword('')
    setConfirmPassword('')
    setShowNewPassword(false)
    setShowConfirmPassword(false)
    setStep('request')
  }

  function handleRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    clearFeedback()

    startTransition(async () => {
      const result = await callAdminApi('/api/admin/password-reset-requests', {
        method: 'POST',
        body: JSON.stringify({ correo: email }),
      })

      if (!result.ok) {
        setError(result.error || 'No se pudo solicitar el restablecimiento.')
        return
      }

      setMessage('Si la cuenta existe, te enviamos un codigo de 6 digitos al correo.')
      setStep('verify')
    })
  }

  function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    clearFeedback()

    startTransition(async () => {
      const result = await callAdminApi<{ token: string; expiraEn: string }>('/api/admin/password-reset-verifications', {
        method: 'POST',
        body: JSON.stringify({ correo: email, codigo: code }),
      })

      if (!result.ok || !result.data) {
        setError(result.error || 'No se pudo validar el codigo.')
        return
      }

      setResetToken(result.data.token)
      setMessage('Codigo validado. Ya puedes definir tu nueva contrasena.')
      setStep('reset')
    })
  }

  function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    clearFeedback()

    if (newPassword !== confirmPassword) {
      setError('Las contrasenas no coinciden.')
      return
    }

    startTransition(async () => {
      const result = await callAdminApi('/api/admin/password-resets', {
        method: 'POST',
        body: JSON.stringify({ token: resetToken, nuevaContrasena: newPassword }),
      })

      if (!result.ok) {
        setError(result.error || 'No se pudo actualizar la contrasena.')
        return
      }

      setMessage('Tu contrasena fue actualizada. Ya puedes volver a iniciar sesion.')
      setStep('done')
    })
  }

  function handleResendCode() {
    clearFeedback()

    startTransition(async () => {
      const result = await callAdminApi('/api/admin/password-reset-requests', {
        method: 'POST',
        body: JSON.stringify({ correo: email }),
      })

      if (!result.ok) {
        setError(result.error || 'No se pudo reenviar el codigo.')
        return
      }

      setMessage('Te enviamos un nuevo codigo al correo administrativo.')
    })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {error ? (
        <div role="alert" className="rounded-2xl border border-danger-500/20 bg-danger-50 px-3 py-2.5 text-xs text-danger-700 sm:px-4 sm:py-3 sm:text-sm">
          {error}
        </div>
      ) : null}

      {message ? (
        <div role="status" aria-live="polite" className="rounded-2xl border border-success-500/20 bg-success-50 px-3 py-2.5 text-xs text-success-500 sm:px-4 sm:py-3 sm:text-sm">
          {message}
        </div>
      ) : null}

      {step === 'request' ? (
        <form onSubmit={handleRequest} className="space-y-4 sm:space-y-5">
          <Field
            label="Correo administrativo"
            icon={Mail}
            id="recovery-email"
            name="correo"
            value={email}
            onChange={setEmail}
            placeholder="Ingresa aquí tu correo electrónico"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            inputRef={emailInputRef}
          />

          <div className="rounded-2xl border border-surface-200 bg-surface-50 px-3 py-2.5 text-xs leading-5 text-surface-500 sm:px-4 sm:py-3 sm:text-sm sm:leading-6">
            Usaremos ese correo para enviarte un codigo temporal de recuperacion.
          </div>

          <button type="submit" disabled={isPending} className="btn-primary w-full justify-center py-2.5 text-sm sm:py-3">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <KeyRound className="h-4 w-4" aria-hidden="true" />}
            Solicitar codigo
          </button>
        </form>
      ) : null}

      {step === 'verify' ? (
        <form onSubmit={handleVerify} className="space-y-4 sm:space-y-5">
          <Field
            label="Correo administrativo"
            icon={Mail}
            id="verify-email"
            name="correo"
            value={email}
            onChange={setEmail}
            placeholder="admin@maestroya.pe"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
          />
          <Field
            label="Codigo de verificacion"
            icon={ShieldCheck}
            id="verify-code"
            name="codigo"
            value={code}
            onChange={setCode}
            placeholder="123456"
            inputMode="numeric"
            maxLength={6}
            autoComplete="one-time-code"
            spellCheck={false}
            inputRef={codeInputRef}
          />

          <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
            <button type="submit" disabled={isPending} className="btn-primary w-full justify-center py-2.5 text-sm sm:py-3">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ShieldCheck className="h-4 w-4" aria-hidden="true" />}
              Validar codigo
            </button>
            <button type="button" onClick={handleResendCode} disabled={isPending || !email} className="btn-secondary w-full justify-center py-2.5 text-sm sm:py-3">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reenviar codigo
            </button>
          </div>

          <button type="button" onClick={() => setStep('request')} className="w-full text-xs font-medium text-brand-600 transition-colors hover:text-brand-800 hover:underline sm:text-sm">
            Cambiar correo administrativo
          </button>

          <div className="rounded-2xl border border-surface-200 bg-surface-50 px-3 py-2.5 text-xs leading-5 text-surface-500 sm:px-4 sm:py-3 sm:text-sm sm:leading-6">
            Si no encuentras el correo, revisa spam o promociones antes de solicitar otro codigo.
          </div>
        </form>
      ) : null}

      {step === 'reset' ? (
        <form onSubmit={handleReset} className="space-y-4 sm:space-y-5">
          <PasswordField
            label="Nueva contrasena"
            id="new-password"
            name="nuevaContrasena"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Minimo 6 caracteres"
            visible={showNewPassword}
            onToggleVisibility={() => setShowNewPassword((value) => !value)}
            autoComplete="new-password"
            inputRef={passwordInputRef}
          />
          <PasswordField
            label="Confirmar contrasena"
            id="confirm-password"
            name="confirmarContrasena"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Repite la contrasena"
            visible={showConfirmPassword}
            onToggleVisibility={() => setShowConfirmPassword((value) => !value)}
            autoComplete="new-password"
          />

          <div className="rounded-2xl border border-surface-200 bg-surface-50 px-3 py-2.5 text-xs leading-5 text-surface-500 sm:px-4 sm:py-3 sm:text-sm sm:leading-6">
            Recomendacion: usa una clave unica con letras, numeros y al menos un simbolo para el acceso administrativo.
          </div>

          <button type="submit" disabled={isPending} className="btn-primary w-full justify-center py-2.5 text-sm sm:py-3">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
            Guardar nueva contrasena
          </button>

          <button type="button" onClick={() => setStep('verify')} className="w-full text-xs font-medium text-brand-600 transition-colors hover:text-brand-800 hover:underline sm:text-sm">
            Volver al paso anterior
          </button>
        </form>
      ) : null}

      {step === 'done' ? (
        <div className="rounded-[24px] border border-success-500/20 bg-success-50 p-5 text-center sm:rounded-[28px] sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-success-500 shadow-sm sm:h-14 sm:w-14">
            <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
          </div>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-success-500 sm:mt-5 sm:text-xs">Acceso restablecido</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-surface-900 sm:text-2xl">Todo listo para volver al panel</h3>
          <p className="mt-3 text-xs leading-5 text-surface-500 sm:text-sm sm:leading-6">
            Tu contrasena administrativa fue actualizada correctamente. Ya puedes iniciar sesion otra vez con la nueva clave.
          </p>

          <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:justify-center sm:gap-3">
            <Link href="/administracion/iniciar-sesion" className="btn-primary justify-center px-5 py-2.5 text-sm sm:px-6 sm:py-3">
              Ir al inicio de sesion
            </Link>
            <button type="button" onClick={resetFlow} className="btn-secondary justify-center px-5 py-2.5 text-sm sm:px-6 sm:py-3">
              Hacer otra recuperacion
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Field({
  label,
  icon: Icon,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  inputMode,
  maxLength,
  autoComplete,
  spellCheck,
  inputRef,
}: {
  label: string
  icon: typeof Mail
  id: string
  name: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  inputMode?: InputMode
  maxLength?: number
  autoComplete?: string
  spellCheck?: boolean
  inputRef?: React.RefObject<HTMLInputElement | null>
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-surface-700">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400 sm:left-3.5 sm:h-[18px] sm:w-[18px]" />
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
          inputMode={inputMode}
          maxLength={maxLength}
          autoComplete={autoComplete}
          spellCheck={spellCheck}
          ref={inputRef}
          className="w-full rounded-xl border border-surface-300 px-3 py-2 pl-10 text-sm text-surface-900 placeholder:text-surface-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-surface-50 disabled:text-surface-500 sm:py-2.5 sm:pl-11"
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

function PasswordField({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  visible,
  onToggleVisibility,
  autoComplete,
  inputRef,
}: {
  label: string
  id: string
  name: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  visible: boolean
  onToggleVisibility: () => void
  autoComplete?: string
  inputRef?: React.RefObject<HTMLInputElement | null>
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-surface-700">
        {label}
      </label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400 sm:left-3.5 sm:h-[18px] sm:w-[18px]" />
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
          autoComplete={autoComplete}
          ref={inputRef}
          className="w-full rounded-xl border border-surface-300 px-3 py-2 pl-10 pr-10 text-sm text-surface-900 placeholder:text-surface-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-surface-50 disabled:text-surface-500 sm:py-2.5 sm:pl-11 sm:pr-11"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-surface-400 hover:bg-surface-100 hover:text-surface-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label={visible ? 'Ocultar contrasena' : 'Mostrar contrasena'}
          title={visible ? 'Ocultar contrasena' : 'Mostrar contrasena'}
        >
          {visible ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />}
        </button>
      </div>
    </div>
  )
}
