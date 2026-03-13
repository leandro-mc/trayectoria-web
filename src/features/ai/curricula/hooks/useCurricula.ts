import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { curriculaApi } from '../api/curricula.api'
import { QUERY_KEYS } from '@/config/query-keys'
import type { GenerateCurriculumRequest } from '../types/curricula.types'

export function useCurricula() {
  return useQuery({
    queryKey: QUERY_KEYS.curricula.all,
    queryFn:  curriculaApi.getAll,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCurriculum(id: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.curricula.detail(id ?? 0),
    queryFn:  () => curriculaApi.getById(id!),
    enabled:  id !== null,
    staleTime: 1000 * 60 * 10,
  })
}

// Returns the latest AI-generated curriculum for the current candidate + offer.
// 404 from the server becomes status:'error' with a falsy `data`.
// retry:false so a 404 resolves immediately — callers use isError to decide.
export function useLatestCurriculum(
  candidateId: number | null | undefined,
  offerId:     number | null,
) {
  return useQuery({
    queryKey: QUERY_KEYS.curricula.latest(candidateId ?? 0, offerId ?? 0),
    queryFn:  () => curriculaApi.getLatest(candidateId!, offerId!),
    enabled:  candidateId != null && offerId != null,
    staleTime: 1000 * 60 * 5,
    retry:    false,   // treat 404 as "not found", don't retry
  })
}

// Builds a virtual curriculum from the candidate's profile.
// id:0 / isAiGenerated:false — not stored in DB.
// Company-only: shown when candidate did not attach a CV to their application.
export function useBaseCurriculum(candidateId: number | null | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.curricula.base(candidateId ?? 0),
    queryFn:  () => curriculaApi.getBase(candidateId!),
    enabled:  candidateId != null,
    staleTime: 1000 * 60 * 10,
  })
}

export function useGenerateCurriculum() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: GenerateCurriculumRequest) => curriculaApi.generate(data),
    onSuccess: (cv) => {
      // Populate the detail cache immediately so subsequent fetches don't re-request
      queryClient.setQueryData(QUERY_KEYS.curricula.detail(cv.id), cv)
      // Populate the latest cache for this offer so the panel finds it on next render
      if (cv.jobOfferId != null) {
        // candidateId is unknown here — invalidate all so it re-fetches correctly
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.curricula.all })
        void queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === 'curricula' && query.queryKey[1] === 'latest',
        })
      }
    },
  })
}

export function useDeleteCurriculum() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => curriculaApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.curricula.all })
    },
  })
}
