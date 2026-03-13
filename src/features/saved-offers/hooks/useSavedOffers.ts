import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { savedOffersApi } from '../api/saved-offers.api'
import { QUERY_KEYS } from '@/config/query-keys'
import { useAuthStore } from '@/stores/auth.store'

export function useSavedOffers(page = 0) {
  return useQuery({
    queryKey: [...QUERY_KEYS.savedOffers.all, page],
    queryFn:  () => savedOffersApi.getAll({ page, size: 10 }),
  })
}

// Checks if a single offer is saved — used by SaveButton
export function useIsSaved(jobOfferId: number | null) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: QUERY_KEYS.savedOffers.check(jobOfferId ?? 0),
    queryFn:  () => savedOffersApi.checkSaved(jobOfferId!),
    enabled:  isAuthenticated && jobOfferId !== null,
    staleTime: 1000 * 60 * 2,
  })
}


export function useSaveOffer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (jobOfferId: number) => savedOffersApi.save(jobOfferId),
    onSuccess: (_, jobOfferId) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.savedOffers.all })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.savedOffers.check(jobOfferId) })
    },
  })
}

export function useUnsaveOffer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (jobOfferId: number) => savedOffersApi.unsave(jobOfferId),
    onSuccess: (_, jobOfferId) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.savedOffers.all })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.savedOffers.check(jobOfferId) })
    },
  })
}
