import { apiClient } from '@/lib/api/client'
import type {
  CandidateProfileResponse,
  UpdateCandidateProfileRequest,
  AvatarResponse,
  WorkExperienceResponse,
  WorkExperienceRequest,
  EducationResponse,
  EducationRequest,
  SkillResponse,
  SkillsRequest,
  LanguageResponse,
  LanguageRequest,
} from '../types/candidate.types'

export const candidateApi = {
  //  Profile 

  getProfile: () =>
    apiClient
      .get<CandidateProfileResponse>('/candidates/me')
      .then((r) => r.data),

  updateProfile: (data: UpdateCandidateProfileRequest) =>
    apiClient
      .put<CandidateProfileResponse>('/candidates/me', data)
      .then((r) => r.data),

  uploadAvatar: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return apiClient
      .patch<AvatarResponse>('/candidates/me/avatar', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },

  //  Work experience 

  getExperience: () =>
    apiClient
      .get<WorkExperienceResponse[]>('/candidates/me/experience')
      .then((r) => r.data),

  addExperience: (data: WorkExperienceRequest) =>
    apiClient
      .post<WorkExperienceResponse>('/candidates/me/experience', data)
      .then((r) => r.data),

  updateExperience: (id: number, data: WorkExperienceRequest) =>
    apiClient
      .put<WorkExperienceResponse>(`/candidates/me/experience/${id}`, data)
      .then((r) => r.data),

  deleteExperience: (id: number) =>
    apiClient.delete(`/candidates/me/experience/${id}`),

  //  Education 

  getEducation: () =>
    apiClient
      .get<EducationResponse[]>('/candidates/me/education')
      .then((r) => r.data),

  addEducation: (data: EducationRequest) =>
    apiClient
      .post<EducationResponse>('/candidates/me/education', data)
      .then((r) => r.data),

  updateEducation: (id: number, data: EducationRequest) =>
    apiClient
      .put<EducationResponse>(`/candidates/me/education/${id}`, data)
      .then((r) => r.data),

  deleteEducation: (id: number) =>
    apiClient.delete(`/candidates/me/education/${id}`),

  //  Skills 

  getSkills: () =>
    apiClient
      .get<SkillResponse[]>('/candidates/me/skills')
      .then((r) => r.data),

  addSkills: (data: SkillsRequest) =>
    apiClient
      .post<SkillResponse[]>('/candidates/me/skills', data)
      .then((r) => r.data),

  deleteSkill: (skillId: number) =>
    apiClient.delete(`/candidates/me/skills/${skillId}`),

  //  Languages 

  getLanguages: () =>
    apiClient
      .get<LanguageResponse[]>('/candidates/me/languages')
      .then((r) => r.data),

  addLanguage: (data: LanguageRequest) =>
    apiClient
      .post<LanguageResponse>('/candidates/me/languages', data)
      .then((r) => r.data),

  deleteLanguage: (language: string) =>
    apiClient.delete(`/candidates/me/languages/${encodeURIComponent(language)}`),
}
