'use client'

import type { ClipboardEvent, FormEvent, KeyboardEvent, MutableRefObject } from 'react'
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
import { toast } from 'sonner'

type Step = 'request' | 'verify' | 'reset' | 'done'
type InputMode = 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'

export function PasswordRecoveryForm() {
  const [step, setStep] = useState<Step>('request')
  const [isPending, startTransition] = useTransition()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [canResend, setCanResend] = useState(true)
  const [resendCountdown, setResendCountdown] = useState(0)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const codeInputRefs = useRef<Array<HTMLInputElement | null>>([])
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const resendTimeoutRef = useRef<number | null>(null)
  const resendIntervalRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (resendTimeoutRef.current) {
        window.clearTimeout(resendTimeoutRef.current)
      }

      if (resendIntervalRef.current) {
        window.clearInterval(resendIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (step === 'request') {
      emailInputRef.current?.focus()
      return
    }

    if (step === 'verify') {
      codeInputRefs.current[0]?.focus()
      return
    }

    if (step === 'reset') {
      passwordInputRef.current?.focus()
    }
  }, [step])

  function clearFeedback() {}

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
        toast.error(result.error || 'No se pudo solicitar el restablecimiento.')
        return
      }

      toast.success('Si la cuenta existe, te enviamos un código de 6 dígitos al correo.')
      setStep('verify')
    })
  }

  function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    clearFeedback()

    if (code.length !== 6) {
      toast.error('Ingresa el código completo de 6 dígitos.')
      return
    }

    startTransition(async () => {
      const result = await callAdminApi<{ token: string; expiraEn: string }>('/api/admin/password-reset-verifications', {
        method: 'POST',
        body: JSON.stringify({ correo: email, codigo: code }),
      })

      if (!result.ok || !result.data) {
        toast.error(result.error || 'No se pudo validar el código.')
        return
      }

      setResetToken(result.data.token)
      toast.success('Código validado. Ya puedes definir tu nueva contraseña.')
      setStep('reset')
    })
  }

  function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    clearFeedback()

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.')
      return
    }

    startTransition(async () => {
      const result = await callAdminApi('/api/admin/password-resets', {
        method: 'POST',
        body: JSON.stringify({ token: resetToken, nuevaContrasena: newPassword }),
      })

      if (!result.ok) {
        toast.error(result.error || 'No se pudo actualizar la contraseña.')
        return
      }

      toast.success('Tu contraseña fue actualizada. Ya puedes volver a iniciar sesión.')
      setStep('done')
    })
  }

  function handleResendCode() {
    if (!canResend) {
      return
    }

    clearFeedback()

    startTransition(async () => {
      const result = await callAdminApi('/api/admin/password-reset-requests', {
        method: 'POST',
        body: JSON.stringify({ correo: email }),
      })

      if (!result.ok) {
        toast.error(result.error || 'No se pudo reenviar el código.')
        return
      }

      toast.success('Te enviamos un nuevo código al correo administrativo.')
      setCanResend(false)
      setResendCountdown(30)

      if (resendTimeoutRef.current) {
        window.clearTimeout(resendTimeoutRef.current)
      }

      if (resendIntervalRef.current) {
        window.clearInterval(resendIntervalRef.current)
      }

      resendIntervalRef.current = window.setInterval(() => {
        setResendCountdown((current) => {
          if (current <= 1) {
            if (resendIntervalRef.current) {
              window.clearInterval(resendIntervalRef.current)
              resendIntervalRef.current = null
            }

            return 0
          }

          return current - 1
        })
      }, 1000)

      resendTimeoutRef.current = window.setTimeout(() => {
        setCanResend(true)
        setResendCountdown(0)
      }, 30000)
    })
  }

  function formatResendCountdown(seconds: number) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
  }

  return (
    <div className="space-y-4 sm:space-y-6">
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

          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-3 py-2.5 text-center text-xs leading-5 text-neutral-500 sm:px-4 sm:py-3 sm:text-sm sm:leading-6">
            Usaremos ese correo para enviarte un código temporal de recuperación.
          </div>

          <button type="submit" disabled={isPending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#EE7070] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#EE7070]/25 transition-all hover:bg-[#D94F4F] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <KeyRound className="h-4 w-4" aria-hidden="true" />}
            Solicitar código
          </button>
        </form>
      ) : null}

      {step === 'verify' ? (
        <form onSubmit={handleVerify} className="space-y-4 sm:space-y-5">
          <OtpCodeField
            label="Código de verificación"
            value={code}
            onChange={setCode}
            inputRefs={codeInputRefs}
          />

          <button type="submit" disabled={isPending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#EE7070] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#EE7070]/25 transition-all hover:bg-[#D94F4F] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ShieldCheck className="h-4 w-4" aria-hidden="true" />}
            Validar código
          </button>

          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-3 py-2.5 text-center text-xs text-neutral-500 sm:px-4 sm:py-3 sm:text-sm">
            {canResend ? (
              <span>Puedes solicitar un nuevo código cuando lo necesites.</span>
            ) : (
              <span>
                Podrás reenviar el código en <span className="font-semibold text-neutral-800">{formatResendCountdown(resendCountdown)}</span>
              </span>
            )}
          </div>

          <button type="button" onClick={handleResendCode} disabled={isPending || !email || !canResend} className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 transition-all hover:bg-neutral-50 disabled:opacity-60 disabled:cursor-not-allowed">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reenviar código
          </button>

          <button type="button" onClick={() => setStep('request')} className="w-full text-sm font-medium text-[#EE7070] transition-colors hover:text-[#D94F4F] hover:underline">
            Cambiar correo administrativo
          </button>
        </form>
      ) : null}

      {step === 'reset' ? (
        <form onSubmit={handleReset} className="space-y-4 sm:space-y-5">
          <PasswordField
            label="Nueva contraseña"
            id="new-password"
            name="nuevaContrasena"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Mínimo 12 caracteres"
            visible={showNewPassword}
            onToggleVisibility={() => setShowNewPassword((value) => !value)}
            autoComplete="new-password"
            inputRef={passwordInputRef}
          />
          <PasswordField
            label="Confirmar contraseña"
            id="confirm-password"
            name="confirmarContrasena"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Repite la contraseña"
            visible={showConfirmPassword}
            onToggleVisibility={() => setShowConfirmPassword((value) => !value)}
            autoComplete="new-password"
          />

          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-3 py-2.5 text-xs leading-5 text-neutral-500 sm:px-4 sm:py-3 sm:text-sm sm:leading-6">
            Recomendación: usa una clave única con letras, números y al menos un símbolo para el acceso administrativo.
          </div>

          <button type="submit" disabled={isPending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#EE7070] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#EE7070]/25 transition-all hover:bg-[#D94F4F] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
            Guardar nueva contraseña
          </button>

          <button type="button" onClick={() => setStep('verify')} className="w-full text-sm font-medium text-[#EE7070] transition-colors hover:text-[#D94F4F] hover:underline">
            Volver al paso anterior
          </button>
        </form>
      ) : null}

      {step === 'done' ? (
        <div className="rounded-2xl border border-green-100 bg-green-50 p-5 text-center sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-green-500 shadow-sm sm:h-14 sm:w-14">
            <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
          </div>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-green-600 sm:mt-5 sm:text-xs">Acceso restablecido</p>
          <h3 className="mt-2 text-xl font-extrabold tracking-tight text-neutral-800 sm:text-2xl">Todo listo para volver al panel</h3>
          <p className="mt-3 text-xs leading-5 text-neutral-500 sm:text-sm sm:leading-6">
            Tu contraseña administrativa fue actualizada correctamente. Ya puedes iniciar sesión otra vez con la nueva clave.
          </p>

          <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:justify-center sm:gap-3">
            <Link href="/administracion/iniciar-sesion" className="flex items-center justify-center gap-2 rounded-xl bg-[#EE7070] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#EE7070]/25 transition-all hover:bg-[#D94F4F] active:scale-[0.98]">
              Ir al inicio de sesión
            </Link>
            <button type="button" onClick={resetFlow} className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 transition-all hover:bg-neutral-50">
              Hacer otra recuperación
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function OtpCodeField({
  label,
  value,
  onChange,
  inputRefs,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  inputRefs: MutableRefObject<Array<HTMLInputElement | null>>
}) {
  const digits = Array.from({ length: 6 }, (_, index) => value[index] ?? '')

  function updateCode(index: number, nextCharacter: string) {
    const sanitized = nextCharacter.replace(/\D/g, '').slice(-1)
    const nextDigits = [...digits]
    nextDigits[index] = sanitized
    onChange(nextDigits.join(''))

    if (sanitized && index < 5) {
      inputRefs.current[index + 1]?.focus()
      inputRefs.current[index + 1]?.select()
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      event.preventDefault()
      const nextDigits = [...digits]
      nextDigits[index - 1] = ''
      onChange(nextDigits.join(''))
      inputRefs.current[index - 1]?.focus()
      return
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault()
      inputRefs.current[index - 1]?.focus()
      return
    }

    if (event.key === 'ArrowRight' && index < 5) {
      event.preventDefault()
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)

    if (!pasted) {
      return
    }

    onChange(pasted)
    inputRefs.current[Math.min(pasted.length - 1, 5)]?.focus()
  }

  return (
    <div className="text-center">
      <label className="mb-1.5 block text-sm font-semibold text-neutral-700">{label}</label>
      <div className="grid grid-cols-6 gap-2 sm:gap-2.5" role="group" aria-label={label}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            aria-label={`Dígito ${index + 1} del código`}
            className="h-12 w-full rounded-xl border border-neutral-200 bg-white text-center text-lg font-semibold tracking-[0.08em] text-neutral-800 transition-all focus:border-[#EE7070] focus:outline-none focus:ring-2 focus:ring-[#EE7070]/20 sm:h-14 sm:text-xl"
            maxLength={1}
            value={digit}
            onChange={(event) => updateCode(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onFocus={(event) => event.currentTarget.select()}
            onPaste={handlePaste}
          />
        ))}
      </div>
      <p className="mt-2 text-[11px] leading-5 text-neutral-400 sm:text-xs">
        Ingresa los 6 dígitos en orden. Puedes pegar el código completo y lo distribuiremos automáticamente.
      </p>
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
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-neutral-700">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 sm:left-3.5 sm:h-[18px] sm:w-[18px]" />
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
          className="w-full rounded-xl border border-neutral-200 px-3 py-2 pl-10 text-sm text-neutral-800 placeholder:text-neutral-400 transition-all focus:border-[#EE7070] focus:outline-none focus:ring-2 focus:ring-[#EE7070]/20 disabled:bg-neutral-50 disabled:text-neutral-400 sm:py-2.5 sm:pl-11"
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
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-neutral-700">
        {label}
      </label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 sm:left-3.5 sm:h-[18px] sm:w-[18px]" />
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
          autoComplete={autoComplete}
          ref={inputRef}
          className="w-full rounded-xl border border-neutral-200 px-3 py-2 pl-10 pr-10 text-sm text-neutral-800 placeholder:text-neutral-400 transition-all focus:border-[#EE7070] focus:outline-none focus:ring-2 focus:ring-[#EE7070]/20 disabled:bg-neutral-50 disabled:text-neutral-400 sm:py-2.5 sm:pl-11 sm:pr-11"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#EE7070]/20 transition-colors"
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          title={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {visible ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />}
        </button>
      </div>
    </div>
  )
}
