import { z } from 'zod'

export const jobOfferSchema = z.object({
  title:                z.string().min(1, 'El título es requerido').max(255),
  description:          z.string().optional().or(z.literal('')),
  responsibilities:     z.string().optional().or(z.literal('')),
  requirements:         z.string().optional().or(z.literal('')),
  benefits:             z.string().optional().or(z.literal('')),
  workMode:             z.enum(['REMOTE', 'HYBRID', 'ON_SITE']).optional(),
  jobType:              z.enum(['FULL_TIME', 'PART_TIME', 'INTERNSHIP']).optional(),
  location:             z.string().max(255).optional().or(z.literal('')),
  requiresInterview:    z.boolean(),
  interviewInstructions:z.string().optional().or(z.literal('')),
  expiresAt:            z.string().optional().or(z.literal('')),
  skillIds:             z.array(z.number()),
})

export type JobOfferFormValues = z.infer<typeof jobOfferSchema>
