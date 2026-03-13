import { apiClient } from '@/lib/api/client'
import type {
  CompanyProfileResponse,
  UpdateCompanyProfileRequest,
  LogoResponse,
  CompanyStatsResponse,
} from '../types/company.types'

export const companyApi = {
  //  Profile 

  getProfile: () =>
    apiClient
      .get<CompanyProfileResponse>('/companies/me')
      .then((r) => r.data),

  updateProfile: (data: UpdateCompanyProfileRequest) =>
    apiClient
      .put<CompanyProfileResponse>('/companies/me', data)
      .then((r) => r.data),

  uploadLogo: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return apiClient
      .patch<LogoResponse>('/companies/me/logo', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },

    getStats: () =>
    apiClient
      .get<CompanyStatsResponse>('/companies/me/stats')
      .then((r) => r.data),
}
