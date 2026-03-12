import { z } from 'zod'

export const companyProfileSchema = z.object({
  companyName: z.string().max(255).optional().or(z.literal('')),
  industry:    z.string().max(150).optional().or(z.literal('')),
  about:       z.string().optional().or(z.literal('')),
  website:     z.string().max(255).optional().or(z.literal('')),
  location:    z.string().max(255).optional().or(z.literal('')),
})

export type CompanyProfileFormValues = z.infer<typeof companyProfileSchema>
