import { z } from 'zod'

//  Login 

export const loginSchema = z.object({
  email:    z.string().email('Ingresa un email válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

//  Register candidate 

export const registerCandidateStep1Schema = z.object({
  email:           z.string().email('Ingresa un email válido'),
  password:        z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path:    ['confirmPassword'],
})

export const registerCandidateStep2Schema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido').max(100),
  lastName:  z.string().min(1, 'El apellido es requerido').max(100),
})


export type RegisterCandidateStep1Values = z.infer<typeof registerCandidateStep1Schema>
export type RegisterCandidateStep2Values = z.infer<typeof registerCandidateStep2Schema>

//  Register company 

export const registerCompanySchema = z.object({
  email:           z.string().email('Ingresa un email válido'),
  password:        z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  companyName:     z.string().min(1, 'El nombre de la empresa es requerido').max(255),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path:    ['confirmPassword'],
})

export type RegisterCompanyFormValues = z.infer<typeof registerCompanySchema>
