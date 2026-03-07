import type {
  SkillResponse,
  WorkExperienceResponse,
  EducationResponse,
  LanguageResponse,
} from '@/types/api.types'

//  Re-exports for convenience 

export type {
  SkillResponse,
  WorkExperienceResponse,
  EducationResponse,
  LanguageResponse,
}

//  Profile 

export interface CandidateProfileResponse {
  userId:          number
  email:           string
  firstName:       string | null
  lastName:        string | null
  phone:           string | null
  location:        string | null
  bio:             string | null
  profileImageUrl: string | null
  linkedinUrl:     string | null
  githubUrl:       string | null
  portfolioUrl:    string | null
  birthdate:       string | null   // 'YYYY-MM-DD'
  skills:          SkillResponse[]
  workExperiences: WorkExperienceResponse[]
  educations:      EducationResponse[]
  languages:       LanguageResponse[]
}

export interface UpdateCandidateProfileRequest {
  firstName?:    string | null
  lastName?:     string | null
  phone?:        string | null
  location?:     string | null
  bio?:          string | null
  linkedinUrl?:  string | null
  githubUrl?:    string | null
  portfolioUrl?: string | null
  birthdate?:    string | null
}

export interface AvatarResponse {
  profileImageUrl: string
}

//  Work Experience 

export interface WorkExperienceRequest {
  company:      string
  position:     string
  description?: string
  startDate?:   string
  endDate?:     string
  isCurrent?:   boolean
}

//  Education 

export interface EducationRequest {
  institution:  string
  degree?:      string
  fieldOfStudy?: string
  startDate?:   string
  endDate?:     string
}

//  Skills 

export interface SkillsRequest {
  skillIds: number[]
}

//  Languages 

export interface LanguageRequest {
  language: string
  level?:   string
}

//  Profile completion 
// Used by ProfileCompletionBar — not from API, computed client-side.

export interface ProfileCompletionItem {
  label:     string
  completed: boolean
}
