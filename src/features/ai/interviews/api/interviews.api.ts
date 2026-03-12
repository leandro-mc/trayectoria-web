import { apiClient } from '@/lib/api/client'
import type {
  SimulatedInterviewResponse,
  CompletedInterviewResponse,
  InterviewMessageResponse,
  StartInterviewRequest,
  SendMessageRequest,
} from '../types/interviews.types'

export const interviewsApi = {
  start: (data: StartInterviewRequest) =>
    apiClient
      .post<SimulatedInterviewResponse>('/interviews', data)
      .then((r) => r.data),

  // List — no incluye mensajes (backend los omite para performance)
  getAll: () =>
    apiClient
      .get<SimulatedInterviewResponse[]>('/interviews')
      .then((r) => r.data),

  // Detail — incluye todos los mensajes
  getById: (id: number) =>
    apiClient
      .get<SimulatedInterviewResponse>(`/interviews/${id}`)
      .then((r) => r.data),

  sendMessage: (id: number, data: SendMessageRequest) =>
    apiClient
      .post<InterviewMessageResponse>(`/interviews/${id}/messages`, data)
      .then((r) => r.data),

  // Retorna CompletedInterviewResponse — distinto de SimulatedInterviewResponse
  complete: (id: number) =>
    apiClient
      .patch<CompletedInterviewResponse>(`/interviews/${id}/complete`)
      .then((r) => r.data),
}
