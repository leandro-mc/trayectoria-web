import { apiClient } from '@/lib/api/client'
import type { PageResponse } from '@/types/api.types'
import type {
  JobOfferResponse,
  JobOfferSummaryResponse,
  CreateJobOfferRequest,
  UpdateJobOfferStatusRequest,
  ListJobOffersParams,
} from '../types/jobs.types'

export const jobsApi = {
  //  Public 

  list: (params: ListJobOffersParams) =>
    apiClient
      .get<PageResponse<JobOfferSummaryResponse>>('/job-offers', { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<JobOfferResponse>(`/job-offers/${id}`)
      .then((r) => r.data),

  //  Company (authenticated) 

  getMine: (params: { page?: number; size?: number }) =>
    apiClient
      .get<PageResponse<JobOfferSummaryResponse>>('/job-offers/mine', { params })
      .then((r) => r.data),

  create: (data: CreateJobOfferRequest) =>
    apiClient
      .post<JobOfferResponse>('/job-offers', data)
      .then((r) => r.data),

  update: (id: number, data: CreateJobOfferRequest) =>
    apiClient
      .put<JobOfferResponse>(`/job-offers/${id}`, data)
      .then((r) => r.data),

  updateStatus: (id: number, data: UpdateJobOfferStatusRequest) =>
    apiClient
      .patch<JobOfferResponse>(`/job-offers/${id}/status`, data)
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`/job-offers/${id}`),
}
