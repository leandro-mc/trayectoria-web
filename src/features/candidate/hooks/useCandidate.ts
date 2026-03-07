import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { candidateApi } from '../api/candidate.api'
import { QUERY_KEYS } from '@/config/query-keys'
import type {
  UpdateCandidateProfileRequest,
  WorkExperienceRequest,
  EducationRequest,
  SkillsRequest,
  LanguageRequest,
} from '../types/candidate.types'

//  Profile 

export function useCandidateProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.candidate.profile,
    queryFn:  candidateApi.getProfile,
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateCandidateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateCandidateProfileRequest) =>
      candidateApi.updateProfile(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.candidate.profile, updated)
    },
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => candidateApi.uploadAvatar(file),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.candidate.profile })
    },
  })
}

//  Work Experience 

export function useWorkExperience() {
  return useQuery({
    queryKey: QUERY_KEYS.candidate.experience,
    queryFn:  candidateApi.getExperience,
  })
}

export function useAddExperience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: WorkExperienceRequest) => candidateApi.addExperience(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.candidate.experience })
    },
  })
}

export function useUpdateExperience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: WorkExperienceRequest }) =>
      candidateApi.updateExperience(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.candidate.experience })
    },
  })
}

export function useDeleteExperience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => candidateApi.deleteExperience(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.candidate.experience })
    },
  })
}

//  Education 

export function useEducation() {
  return useQuery({
    queryKey: QUERY_KEYS.candidate.education,
    queryFn:  candidateApi.getEducation,
  })
}

export function useAddEducation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: EducationRequest) => candidateApi.addEducation(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.candidate.education })
    },
  })
}

export function useUpdateEducation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EducationRequest }) =>
      candidateApi.updateEducation(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.candidate.education })
    },
  })
}

export function useDeleteEducation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => candidateApi.deleteEducation(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.candidate.education })
    },
  })
}

//  Skills 

export function useCandidateSkills() {
  return useQuery({
    queryKey: QUERY_KEYS.candidate.skills,
    queryFn:  candidateApi.getSkills,
  })
}

export function useAddSkills() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SkillsRequest) => candidateApi.addSkills(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.candidate.skills, updated)
    },
  })
}

export function useDeleteSkill() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (skillId: number) => candidateApi.deleteSkill(skillId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.candidate.skills })
    },
  })
}

//  Languages 

export function useLanguages() {
  return useQuery({
    queryKey: QUERY_KEYS.candidate.languages,
    queryFn:  candidateApi.getLanguages,
  })
}

export function useAddLanguage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: LanguageRequest) => candidateApi.addLanguage(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.candidate.languages })
    },
  })
}

export function useDeleteLanguage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (language: string) => candidateApi.deleteLanguage(language),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.candidate.languages })
    },
  })
}
