import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { savedOffersApi } from '../api/saved-offers.api'
import { QUERY_KEYS } from '@/config/query-keys'

export function useSavedOffers(page = 0) {
  return useQuery({
    queryKey: [...QUERY_KEYS.savedOffers.all, page],
    queryFn:  () => savedOffersApi.getAll({ page, size: 10 }),
  })
}

export function useSaveOffer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (jobOfferId: number) => savedOffersApi.save(jobOfferId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.savedOffers.all })
    },
  })
}

export function useUnsaveOffer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (jobOfferId: number) => savedOffersApi.unsave(jobOfferId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.savedOffers.all })
    },
  })
}
