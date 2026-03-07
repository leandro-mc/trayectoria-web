import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { applicationsApi } from '../api/applications.api'
import { QUERY_KEYS } from '@/config/query-keys'
import type { ApplyRequest } from '../types/applications.types'

export function useMyApplications(page = 0) {
  return useQuery({
    queryKey: [...QUERY_KEYS.applications.mine, page],
    queryFn:  () => applicationsApi.getMine({ page, size: 10 }),
  })
}

export function useApply() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ jobOfferId, data }: { jobOfferId: number; data?: ApplyRequest }) =>
      applicationsApi.apply(jobOfferId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.applications.mine })
    },
  })
}

export function useWithdrawApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => applicationsApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.applications.mine })
    },
  })
}
