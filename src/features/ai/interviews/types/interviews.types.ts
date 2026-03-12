
import type { InterviewStatus, MessageRole, InterviewRecommendation } from '@/types/global.types'

export interface InterviewMessageResponse {
  id:      number
  role:    MessageRole
  content: string
  sentAt:  string
}

export interface SimulatedInterviewResponse {
  id:            number
  jobOfferId:    number | null
  jobOfferTitle: string | null
  status:        InterviewStatus
  createdAt:     string
  completedAt:   string | null
  messages:      InterviewMessageResponse[]
}

export interface InterviewFeedback {
  overallScore:        number
  summary:             string
  strengths:           string[]
  areasForImprovement: string[]
  recommendation:      InterviewRecommendation
  details:             string
}

export interface CompletedInterviewResponse {
  interview: SimulatedInterviewResponse
  feedback:  InterviewFeedback
}

export interface StartInterviewRequest {
  jobOfferId: number
}

export interface SendMessageRequest {
  content: string
}
