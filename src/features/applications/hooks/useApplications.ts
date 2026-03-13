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

// Checks whether the current candidate has already applied to a given offer.
// Fetches up to 200 applications (enough for any real user) and checks locally.
// Cache is invalidated by useApply onSuccess so this stays accurate.
export function useHasApplied(jobOfferId: number | null) {
  const { data } = useQuery({
    queryKey:  [...QUERY_KEYS.applications.mine, 'all'],
    queryFn:   () => applicationsApi.getMine({ page: 0, size: 200 }),
    enabled:   jobOfferId !== null,
    staleTime: 1000 * 60 * 5,
  })

  const application = data?.content.find((a) => a.jobOfferId === jobOfferId) ?? null

  return {
    hasApplied:  application !== null,
    application,
  }
}
