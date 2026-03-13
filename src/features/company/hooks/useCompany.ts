import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { companyApi } from '../api/company.api'
import { QUERY_KEYS } from '@/config/query-keys'
import type { UpdateCompanyProfileRequest } from '../types/company.types'

export function useCompanyProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.company.profile,
    queryFn:  companyApi.getProfile,
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateCompanyProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateCompanyProfileRequest) =>
      companyApi.updateProfile(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.company.profile, updated)
    },
  })
}

export function useUploadLogo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => companyApi.uploadLogo(file),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.company.profile })
    },
  })
}

export function useCompanyStats() {
  return useQuery({
    queryKey: QUERY_KEYS.company.stats,
    queryFn:  companyApi.getStats,
    staleTime: 1000 * 60 * 2,
  })
}
