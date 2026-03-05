import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobsApi } from '../api/jobs.api'
import { QUERY_KEYS } from '@/config/query-keys'
import type { ListJobOffersParams } from '../types/jobs.types'
import type { CreateJobOfferRequest } from '../types/jobs.types'

//  Public list 

export function useJobOffers(params: ListJobOffersParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.jobs.list(params as Record<string, unknown>),
    queryFn:  () => jobsApi.list({ size: 10, ...params }),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

//  Single offer (public) 

export function useJobOffer(id: number) {
  return useQuery({
    queryKey: QUERY_KEYS.jobs.detail(id),
    queryFn:  () => jobsApi.getById(id),
    enabled:  !!id,
  })
}

//  Company: my offers 

export function useMyJobOffers(page = 0) {
  return useQuery({
    queryKey: [...QUERY_KEYS.jobs.mine, page],
    queryFn:  () => jobsApi.getMine({ page, size: 10 }),
  })
}

//  Company: create 

export function useCreateJobOffer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateJobOfferRequest) => jobsApi.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.jobs.all })
    },
  })
}

//  Company: update status 

export function useUpdateJobOfferStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      jobsApi.updateStatus(id, { status: status as 'ACTIVE' | 'CLOSED' | 'DRAFT' }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.jobs.all })
    },
  })
}

//  Company: delete 

export function useDeleteJobOffer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => jobsApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.jobs.all })
    },
  })
}
