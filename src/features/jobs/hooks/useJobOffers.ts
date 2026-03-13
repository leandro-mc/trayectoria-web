import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobsApi } from '../api/jobs.api'
import { QUERY_KEYS } from '@/config/query-keys'
import type { ListJobOffersParams, CreateJobOfferRequest } from '../types/jobs.types'

//  Public list 

export function useJobOffers(params: ListJobOffersParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.jobs.list(params as Record<string, unknown>),
    queryFn:  () => jobsApi.list({ size: 12, ...params }),
    staleTime: 1000 * 60 * 2, // 2 minutes
    // Keep previous page data visible while fetching next page
    placeholderData: (prev) => prev,
  })
}

//  Single offer (public) 

export function useJobOffer(id: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.jobs.detail(id ?? 0),
    queryFn:  () => jobsApi.getById(id!),
    enabled:  id !== null,
    staleTime: 1000 * 60 * 5,
  })
}

// Interview instructions (company-only) 
// Separate endpoint because interviewInstructions is not included in the
// public GET /job-offers/{id} response — only the owning company can fetch it.

export function useInterviewInstructions(id: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.jobs.interviewInstructions(id ?? 0),
    queryFn:  () => jobsApi.getInterviewInstructions(id!),
    enabled:  id !== null,
    staleTime: 1000 * 60 * 10,
    retry:    false,  // 403 on wrong company — don't retry
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

//  Company: update full offer 

export function useUpdateJobOffer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateJobOfferRequest }) =>
      jobsApi.update(id, data),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.jobs.all })
      // Also invalidate interview instructions cache so the edit page re-fetches
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.jobs.interviewInstructions(updated.id),
      })
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
