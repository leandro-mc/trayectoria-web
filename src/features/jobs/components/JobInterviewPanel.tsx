// Right panel for AI mode = 'interview'.
// Resumes an existing IN_PROGRESS interview for this job, or auto-starts a new one.

'use client'

import { useEffect, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useInterviews, useStartInterview, useInterview } from '@/features/ai/interviews/hooks/useInterviews'
import { loadFeedback } from '@/features/ai/interviews/utils/feedback-cache'
import { InterviewChat } from '@/features/ai/interviews/components/InterviewChat'
import { useJobsParams } from '../hooks/useJobsParams'

//  Starting skeleton 

function StartingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center animate-pulse"
        style={{ background: 'linear-gradient(135deg,#A855F7,#6366F1)' }}
      >
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <p className="text-sm text-ai-600 dark:text-ai-400 font-medium animate-pulse">
        Preparando tu entrevista…
      </p>
      <div className="w-full max-w-xs space-y-2">
        {[80, 65, 75].map((w, i) => (
          <div
            key={i}
            className="h-3 rounded-lg animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800"
            style={{ width: `${w}%`, marginLeft: 'auto', marginRight: 'auto' }}
          />
        ))}
      </div>
    </div>
  )
}

//  Inner chat — loads detail once we have an interviewId 

function InterviewChatLoader({ interviewId }: { interviewId: number }) {
  const { data: interview, isLoading } = useInterview(interviewId)

  if (isLoading || !interview) return <StartingSkeleton />

  return (
    <InterviewChat
      interview={interview}
      initialFeedback={loadFeedback(interviewId)}
      messagesClassName="flex-1 min-h-0"
    />
  )
}

//  Panel 

export function JobInterviewPanel() {
  const { selectedId } = useJobsParams()
  const jobOfferId     = selectedId!

  const { data: interviews = [], isLoading: loadingList } = useInterviews()
  const { mutate: start, isPending: starting }            = useStartInterview()

  const [activeInterviewId, setActiveInterviewId] = useState<number | null>(null)
  const triggered = useRef(false)

  useEffect(() => {
    if (loadingList) return
    if (triggered.current) return

    // Resume existing IN_PROGRESS interview for this job
    const existing = interviews.find(
      (iv) => iv.jobOfferId === jobOfferId && iv.status === 'IN_PROGRESS',
    )

    if (existing) {
      setActiveInterviewId(existing.id)
    } else {
      triggered.current = true
      start(
        { jobOfferId },
        { onSuccess: (iv) => setActiveInterviewId(iv.id) },
      )
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingList])

  // Reset when job changes
  useEffect(() => {
    triggered.current = false
    setActiveInterviewId(null)
  }, [jobOfferId])

  const isLoading = loadingList || (starting && !activeInterviewId)

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900">

      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg,#A855F7,#6366F1)' }}
        >
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          Entrevista simulada con IA
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-h-0">
        {isLoading || !activeInterviewId
          ? <StartingSkeleton />
          : <InterviewChatLoader interviewId={activeInterviewId} />
        }
      </div>
    </div>
  )
}
