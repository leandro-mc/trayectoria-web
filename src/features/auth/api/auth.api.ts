import { apiClient } from '@/lib/api/client'
import type {
  LoginRequest,
  RegisterCandidateRequest,
  RegisterCompanyRequest,
  RefreshTokenRequest,
  AuthResponse,
} from '../types/auth.types'

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient
      .post<AuthResponse>('/auth/login', data)
      .then((r) => r.data),

  registerCandidate: (data: RegisterCandidateRequest) =>
    apiClient
      .post<AuthResponse>('/auth/register/candidate', data)
      .then((r) => r.data),

  registerCompany: (data: RegisterCompanyRequest) =>
    apiClient
      .post<AuthResponse>('/auth/register/company', data)
      .then((r) => r.data),

  refresh: (data: RefreshTokenRequest) =>
    apiClient
      .post<AuthResponse>('/auth/refresh', data)
      .then((r) => r.data),
}
