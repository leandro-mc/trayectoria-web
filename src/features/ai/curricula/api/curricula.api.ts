import { apiClient } from '@/lib/api/client'
import type {
  GeneratedCurriculumResponse,
  GenerateCurriculumRequest,
} from '../types/curricula.types'

export const curriculaApi = {
  generate: (data: GenerateCurriculumRequest) =>
    apiClient
      .post<GeneratedCurriculumResponse>('/curricula/generate', data)
      .then((r) => r.data),

  getAll: () =>
    apiClient
      .get<GeneratedCurriculumResponse[]>('/curricula')
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<GeneratedCurriculumResponse>(`/curricula/${id}`)
      .then((r) => r.data),

  // Returns the most recent AI-generated curriculum for a candidate+offer pair.
  // 404 when none exists — callers should treat this as "needs generation".
  getLatest: (candidateId: number, offerId: number) =>
    apiClient
      .get<GeneratedCurriculumResponse>('/curricula/latest', {
        params: { candidateId, offerId },
      })
      .then((r) => r.data),

  // Builds a virtual curriculum from the candidate's profile data.
  // Returns id:0, jobOfferId:null, isAiGenerated:false — not stored in DB.
  // Company-only: used when candidate did not attach a CV to their application.
  getBase: (candidateId: number) =>
    apiClient
      .get<GeneratedCurriculumResponse>(`/curricula/base/${candidateId}`)
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`/curricula/${id}`),
}
