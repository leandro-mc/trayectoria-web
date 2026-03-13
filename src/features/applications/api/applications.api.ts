import { apiClient } from '@/lib/api/client'
import type { PageResponse } from '@/types/api.types'
import type {
  JobApplicationResponse,
  ApplyRequest,
  UpdateApplicationStatusRequest,
} from '../types/applications.types'

export const applicationsApi = {
  apply: (jobOfferId: number, data?: ApplyRequest) =>
    apiClient
      .post<JobApplicationResponse>(`/job-offers/${jobOfferId}/apply`, data ?? {})
      .then((r) => r.data),

  getMine: (params: { page?: number; size?: number } = {}) =>
    apiClient
      .get<PageResponse<JobApplicationResponse>>('/applications/mine', { params })
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`/applications/${id}`),

  // Company
  getForOffer: (offerId: number, params: { page?: number; size?: number } = {}) =>
    apiClient
      .get<PageResponse<JobApplicationResponse>>(
        `/job-offers/${offerId}/applications`,
        { params },
      )
      .then((r) => r.data),

  updateStatus: (id: number, data: UpdateApplicationStatusRequest) =>
    apiClient
      .patch<JobApplicationResponse>(`/applications/${id}/status`, data)
      .then((r) => r.data),
}
