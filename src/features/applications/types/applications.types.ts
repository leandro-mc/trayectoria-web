import type { ApplicationStatus } from '@/types/global.types'

export interface JobApplicationResponse {
  id:             number
  candidateId:    number
  jobOfferId:     number
  jobOfferTitle:  string
  companyName:    string | null
  status:         ApplicationStatus
  appliedAt:      string
  updatedAt:      string | null
}

export interface ApplyRequest {
  curriculumId?: number
}

export interface UpdateApplicationStatusRequest {
  status: Exclude<ApplicationStatus, 'PENDING'>
}
