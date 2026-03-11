// Company-side: list and manage applications for a specific offer

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { applicationsApi } from '../api/applications.api'
import { QUERY_KEYS } from '@/config/query-keys'
import type { UpdateApplicationStatusRequest } from '../types/applications.types'

export function useJobApplications(offerId: number, page = 0) {
  return useQuery({
    queryKey: [...QUERY_KEYS.applications.forOffer(offerId), page],
    queryFn:  () => applicationsApi.getForOffer(offerId, { page, size: 20 }),
    enabled:  !!offerId,
  })
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id:   number
      data: UpdateApplicationStatusRequest
    }) => applicationsApi.updateStatus(id, data),
    onSuccess: (updated) => {
      // Invalidate the specific offer's applications list
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.applications.forOffer(updated.jobOfferId),
      })
    },
  })
}
