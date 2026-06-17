import { z } from 'zod'

// Contraseña admin: exigimos 12+ caracteres (más fuerte que el mínimo de
// InsForge) con al menos una letra y un número.
const adminPassword = z
  .string()
  .min(12, 'La contraseña debe tener al menos 12 caracteres.')
  .max(128, 'La contraseña es demasiado larga.')
  .regex(/[a-zA-Z]/, 'La contraseña debe incluir al menos una letra.')
  .regex(/[0-9]/, 'La contraseña debe incluir al menos un número.')

export const loginSchema = z.object({
  correo: z.string().trim().toLowerCase().email('Ingresa un correo válido.'),
  contrasena: z.string().min(1, 'Ingresa tu contraseña.').max(128),
})

export const resetRequestSchema = z.object({
  correo: z.string().trim().toLowerCase().email('Ingresa un correo válido.'),
})

export const resetVerifySchema = z.object({
  correo: z.string().trim().toLowerCase().email('Ingresa un correo válido.'),
  codigo: z.string().regex(/^\d{6}$/, 'El código debe tener 6 dígitos.'),
})

export const resetSchema = z.object({
  token: z.string().min(1, 'Falta el token de restablecimiento.'),
  nuevaContrasena: adminPassword,
})
