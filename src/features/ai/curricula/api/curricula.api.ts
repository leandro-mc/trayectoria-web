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

  delete: (id: number) =>
    apiClient.delete(`/curricula/${id}`),
}
