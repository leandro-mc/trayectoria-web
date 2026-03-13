import { z } from 'zod'

export const profileSchema = z.object({
  firstName:    z.string().max(100).optional().or(z.literal('')),
  lastName:     z.string().max(100).optional().or(z.literal('')),
  phone:        z.string().max(20).optional().or(z.literal('')),
  location:     z.string().max(255).optional().or(z.literal('')),
  bio:          z.string().optional().or(z.literal('')),
  linkedinUrl:  z.string().max(255).optional().or(z.literal('')),
  githubUrl:    z.string().max(255).optional().or(z.literal('')),
  portfolioUrl: z.string().max(255).optional().or(z.literal('')),
  birthdate:    z.string().optional().or(z.literal('')),
})

export const workExperienceSchema = z.object({
  company:     z.string().min(1, 'El nombre de la empresa es requerido'),
  position:    z.string().min(1, 'El cargo es requerido'),
  description: z.string().optional().or(z.literal('')),
  startDate:   z.string().optional().or(z.literal('')),
  endDate:     z.string().optional().or(z.literal('')),
  isCurrent:   z.boolean(),
})

export const educationSchema = z.object({
  institution:   z.string().min(1, 'La institución es requerida'),
  degree:        z.string().optional().or(z.literal('')),
  fieldOfStudy:  z.string().optional().or(z.literal('')),
  startDate:     z.string().optional().or(z.literal('')),
  endDate:       z.string().optional().or(z.literal('')),
})

export const languageSchema = z.object({
  language: z.string().min(1, 'El idioma es requerido'),
  level:    z.string().optional(),
})

export type ProfileFormValues       = z.infer<typeof profileSchema>
export type WorkExperienceFormValues = z.infer<typeof workExperienceSchema>
export type EducationFormValues      = z.infer<typeof educationSchema>
export type LanguageFormValues       = z.infer<typeof languageSchema>
