import type { ApplicationStatus } from '@/types/global.types'

export interface JobApplicationResponse {
  id:             number
  status:         ApplicationStatus
  appliedAt:      string
  updatedAt:      string | null  

  // Info de la oferta — siempre presente
  jobOfferId:     number
  jobOfferTitle:  string | null
  companyName:    string | null

  // Info del candidato — presente en vista de empresa
  candidateId:    number
  candidateFirstName: string  | null
  candidateLastName: string | null
  candidateEmail: string | null
  
  // Currículum adjunto — presente si se postulo con uno
  curriculumId: number | null
}

export interface ApplyRequest {
  curriculumId?: number
}

export interface UpdateApplicationStatusRequest {
  status: Exclude<ApplicationStatus, 'PENDING'>
}
