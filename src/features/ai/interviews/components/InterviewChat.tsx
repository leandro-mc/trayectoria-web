// Reusable chat component — handles IN_PROGRESS (active) and COMPLETED (read-only + feedback).
// Used by JobInterviewPanel (split panel) and /ai/interviews/[id] (full page).

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Send, Loader2, Sparkles, CheckCircle2, Mic,
  Star, TrendingUp, AlertCircle, ThumbsUp,
} from 'lucide-react'
import { useSendMessage, useCompleteInterview } from '../hooks/useInterviews'
import { saveFeedback } from '../utils/feedback-cache'
import {
  INTERVIEW_RECOMMENDATION_LABELS,
  INTERVIEW_RECOMMENDATION_COLORS,
} from '@/config/constants'
import { formatDate } from '@/lib/utils/date'
import { cn } from '@/lib/utils/cn'
import type { SimulatedInterviewResponse, InterviewFeedback } from '../types/interviews.types'

//  Sub-components 

function MessageBubble({
  role, content, sentAt,
}: {
  role:    'USER' | 'ASSISTANT'
  content: string
  sentAt:  string
}) {
  const isUser = role === 'USER'
  return (
    <div className={cn('flex gap-2.5', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5',
          isUser
            ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 text-xs font-bold'
            : 'text-white',
        )}
        style={!isUser ? { background: 'linear-gradient(135deg,#A855F7,#6366F1)' } : undefined}
      >
        {isUser ? 'Tú' : <Sparkles className="w-3.5 h-3.5" />}
      </div>
      <div className={cn(
        'max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
        isUser
          ? 'bg-brand-500 text-white rounded-tr-sm'
          : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-tl-sm',
      )}>
        <p className="whitespace-pre-wrap">{content}</p>
        <p className={cn('text-[10px] mt-1.5', isUser ? 'text-brand-200' : 'text-neutral-400')}>
          {formatDate(sentAt)}
        </p>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0"
        style={{ background: 'linear-gradient(135deg,#A855F7,#6366F1)' }}
      >
        <Sparkles className="w-3.5 h-3.5" />
      </div>
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

function FeedbackSection({ feedback }: { feedback: InterviewFeedback }) {
  return (
    <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-4">

      {/* Score + recommendation */}
      <div
        className="text-center py-5 rounded-2xl border border-ai-100 dark:border-ai-900"
        style={{ background: 'linear-gradient(135deg,rgba(168,85,247,.06),rgba(99,102,241,.06))' }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star className="w-4 h-4 text-ai-500" />
          <span className="text-xs font-semibold text-ai-600 dark:text-ai-400 uppercase tracking-wide">
            Feedback de la IA
          </span>
        </div>
        <p className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
          {feedback.overallScore}
          <span className="text-xl text-neutral-400 font-normal">/10</span>
        </p>
        <span className={cn(
          'inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium',
          INTERVIEW_RECOMMENDATION_COLORS[feedback.recommendation],
        )}>
          {INTERVIEW_RECOMMENDATION_LABELS[feedback.recommendation]}
        </span>
      </div>

      {/* Summary */}
      <div className="p-4 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">Resumen</p>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {feedback.summary}
        </p>
      </div>

      {/* Strengths */}
      {feedback.strengths.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ThumbsUp className="w-3.5 h-3.5 text-success-500" />
            <p className="text-xs font-semibold text-success-600 uppercase tracking-wide">Fortalezas</p>
          </div>
          <ul className="space-y-2">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-success-500 mt-0.5 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Areas for improvement */}
      {feedback.areasForImprovement.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-warning-500" />
            <p className="text-xs font-semibold text-warning-600 uppercase tracking-wide">Áreas a mejorar</p>
          </div>
          <ul className="space-y-2">
            {feedback.areasForImprovement.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                <AlertCircle className="w-3.5 h-3.5 text-warning-500 mt-0.5 shrink-0" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Detailed */}
      <div className="p-4 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
        <p className="text-xs font-semibold text-ai-600 dark:text-ai-400 uppercase tracking-wide mb-2">
          Feedback detallado
        </p>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {feedback.details}
        </p>
      </div>
    </div>
  )
}

//  Main component 

interface InterviewChatProps {
  interview:          SimulatedInterviewResponse
  initialFeedback:    InterviewFeedback | null   // from localStorage on initial render
  // containerClassName controls the height of the scroll area:
  //   - split panel:  "flex-1 min-h-0"
  //   - full page:    "min-h-[calc(100dvh-300px)]"
  messagesClassName?: string
}

export function InterviewChat({
  interview,
  initialFeedback,
  messagesClassName = 'flex-1 min-h-0',
}: InterviewChatProps) {
  const [input, setInput]       = useState('')
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(initialFeedback)
  const scrollRef               = useRef<HTMLDivElement>(null)
  const textareaRef             = useRef<HTMLTextAreaElement>(null)

  const isCompleted = interview.status === 'COMPLETED'

  const { mutate: send,     isPending: sending    } = useSendMessage(interview.id)
  const { mutate: complete, isPending: completing } = useCompleteInterview(interview.id)

  // Scroll to bottom on new messages
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [interview.messages.length, sending])

  const resetInput = useCallback(() => {
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }, [])

  function handleSend() {
    const content = input.trim()
    if (!content || sending || isCompleted) return
    resetInput()
    send({ content })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleComplete() {
    if (!confirm('¿Finalizar la entrevista? Recibirás feedback detallado.')) return
    complete(undefined, {
      onSuccess: (data) => {
        saveFeedback(interview.id, data.feedback)
        setFeedback(data.feedback)
      },
    })
  }

  return (
    <div className="flex flex-col h-full">

      {/* Finish button — only when in progress */}
      {!isCompleted && (
        <div className="shrink-0 flex justify-end px-4 pt-3 pb-1">
          <button
            onClick={handleComplete}
            disabled={completing || interview.messages.length < 2}
            className="inline-flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 transition-colors"
          >
            {completing && <Loader2 className="w-3 h-3 animate-spin" />}
            Finalizar entrevista
          </button>
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        className={cn('overflow-y-auto px-4 py-3 space-y-4 bg-neutral-50 dark:bg-neutral-950', messagesClassName)}
      >
        {interview.messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
            sentAt={msg.sentAt}
          />
        ))}

        {sending && <TypingIndicator />}

        {/* Completed without feedback from current session — just the checkmark */}
        {isCompleted && !sending && !feedback && (
          <div className="flex flex-col items-center py-4 text-center">
            <CheckCircle2 className="w-7 h-7 text-success-500 mb-2" />
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Entrevista completada
            </p>
          </div>
        )}

        {/* Feedback — always at the bottom when available */}
        {feedback && <FeedbackSection feedback={feedback} />}
      </div>

      {/* Input — hidden when completed */}
      {!isCompleted && (
        <div className="shrink-0 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending}
              placeholder="Escribí tu respuesta… (Enter para enviar)"
              rows={1}
              className="flex-1 resize-none rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3.5 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50 overflow-y-auto"
              style={{ minHeight: '42px', maxHeight: '128px' }}
              onInput={(e) => {
                const el = e.currentTarget
                el.style.height = 'auto'
                el.style.height = `${Math.min(el.scrollHeight, 128)}px`
              }}
            />
            <button
              onClick={handleSend}
              disabled={sending || !input.trim()}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-40 hover:opacity-90 transition-opacity shrink-0"
              style={{ background: 'linear-gradient(135deg,#A855F7,#6366F1)' }}
            >
              {sending
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Send className="w-4 h-4" />
              }
            </button>
            {/* Voice — Phase 2 placeholder */}
            <button
              disabled
              title="Próximamente — entrevista por voz"
              className="w-10 h-10 rounded-xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-300 dark:text-neutral-600 cursor-not-allowed shrink-0"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-neutral-400 mt-1.5 px-1">
            Shift+Enter para nueva línea · Enter para enviar
          </p>
        </div>
      )}
    </div>
  )
}
