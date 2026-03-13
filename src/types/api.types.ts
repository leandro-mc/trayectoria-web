//  Pagination 

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

//  Error 

export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
  details?: string[]
}

//  Shared Domain Types 

export interface SkillResponse {
  id: number
  name: string
  type: 'TECHNICAL' | 'SOFT' | 'TOOL' | 'LANGUAGE' | null
}

export interface WorkExperienceResponse {
  id: number
  company: string | null
  position: string | null
  description: string | null
  startDate: string | null   // 'YYYY-MM-DD'
  endDate: string | null     // 'YYYY-MM-DD', null if isCurrent
  isCurrent: boolean
}

export interface EducationResponse {
  id: number
  institution: string | null
  degree: string | null
  fieldOfStudy: string | null
  startDate: string | null
  endDate: string | null
}

export interface LanguageResponse {
  language: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Native' | null
}

//  Auth 

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  email: string
  role: 'CANDIDATE' | 'COMPANY'
}
