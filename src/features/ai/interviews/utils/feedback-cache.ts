// Persists interview feedback in localStorage so it survives navigation.
// The API only returns feedback on PATCH /complete — not on GET /interviews/:id.

import type { InterviewFeedback } from '../types/interviews.types'

const key = (id: number) => `tia-feedback-${id}`

export function saveFeedback(interviewId: number, feedback: InterviewFeedback): void {
  try {
    localStorage.setItem(key(interviewId), JSON.stringify(feedback))
  } catch {
    // Storage quota or SSR — silently ignore
  }
}

export function loadFeedback(interviewId: number): InterviewFeedback | null {
  try {
    const raw = localStorage.getItem(key(interviewId))
    return raw ? (JSON.parse(raw) as InterviewFeedback) : null
  } catch {
    return null
  }
}
