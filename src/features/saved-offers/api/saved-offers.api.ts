import { apiClient } from '@/lib/api/client'
import type { PageResponse } from '@/types/api.types'
import type { JobOfferSummaryResponse } from '@/features/jobs/types/jobs.types'

export interface SavedCheckResponse {
  saved: boolean
}

export const savedOffersApi = {
  getAll: (params: { page?: number; size?: number } = {}) =>
    apiClient
      .get<PageResponse<JobOfferSummaryResponse>>('/saved-offers', { params })
      .then((r) => r.data),

  save: (jobOfferId: number) =>
    apiClient.post(`/saved-offers/${jobOfferId}`),

  unsave: (jobOfferId: number) =>
    apiClient.delete(`/saved-offers/${jobOfferId}`),

  checkSaved: (jobOfferId: number) =>
    apiClient
      .get<SavedCheckResponse>(`/saved-offers/${jobOfferId}/check`)
      .then((r) => r.data),
}
