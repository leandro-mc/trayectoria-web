import type { AuthResponse, ApiError } from '@/types/api.types'
import type { UserRole } from '@/types/global.types'

//  Re-export for convenience 

export type { AuthResponse }

//  Request DTOs 

export interface LoginRequest {
  email:    string
  password: string
}

export interface RegisterCandidateRequest {
  email:     string
  password:  string
  firstName: string
  lastName:  string
}

export interface RegisterCompanyRequest {
  email:       string
  password:    string
  companyName: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

//  Internal auth state 

export interface AuthUser {
  email: string
  role:  UserRole
}

export type { ApiError }
