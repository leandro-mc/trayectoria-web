import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { interviewsApi } from '../api/interviews.api'
import { QUERY_KEYS } from '@/config/query-keys'
import type {
  SimulatedInterviewResponse,
  StartInterviewRequest,
  SendMessageRequest,
} from '../types/interviews.types'

export function useInterviews() {
  return useQuery({
    queryKey: QUERY_KEYS.interviews.all,
    queryFn:  interviewsApi.getAll,
    staleTime: 1000 * 60 * 2,
  })
}

export function useInterview(id: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.interviews.detail(id ?? 0),
    queryFn:  () => interviewsApi.getById(id!),
    enabled:  id !== null,
    staleTime: Infinity,
  })
}

export function useStartInterview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: StartInterviewRequest) => interviewsApi.start(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.interviews.all })
    },
  })
}

export function useSendMessage(interviewId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SendMessageRequest) =>
      interviewsApi.sendMessage(interviewId, data),
    // The API only returns the AI response — we need to add BOTH messages to cache.
    // The user message gets a temp ID (Date.now()); it'll be reconciled on next fetch.
    onSuccess: (aiMessage, variables) => {
      queryClient.setQueryData(
        QUERY_KEYS.interviews.detail(interviewId),
        (old: SimulatedInterviewResponse | undefined) => {
          if (!old) return old
          const userMessage = {
            id:      Date.now(),
            role:    'USER' as const,
            content: variables.content,
            sentAt:  new Date().toISOString(),
          }
          return { ...old, messages: [...old.messages, userMessage, aiMessage] }
        },
      )
    },
  })
}

export function useCompleteInterview(interviewId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    // void mutationFn — call as mutate() with no arguments
    mutationFn: () => interviewsApi.complete(interviewId),
    onSuccess: (data) => {
      queryClient.setQueryData(
        QUERY_KEYS.interviews.detail(interviewId),
        data.interview,
      )
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.interviews.all })
    },
  })
}
