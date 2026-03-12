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

export function useGenerateCurriculum() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: GenerateCurriculumRequest) => curriculaApi.generate(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.curricula.all })
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
