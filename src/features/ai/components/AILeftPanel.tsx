// Shared left panel for /ai/* split panel pages.
// Contains tabs (Currículums | Entrevistas) + list for the active section.

'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import {
  FileText, MessageSquare, CheckCircle2, Clock,
  Sparkles, ChevronRight,
} from 'lucide-react'
import { useCurricula } from '@/features/ai/curricula/hooks/useCurricula'
import { useInterviews } from '@/features/ai/interviews/hooks/useInterviews'
import { ROUTES } from '@/config/routes'
import { formatDate } from '@/lib/utils/date'
import { cn } from '@/lib/utils/cn'
import type { GeneratedCurriculumResponse } from '@/features/ai/curricula/types/curricula.types'
import type { SimulatedInterviewResponse } from '@/features/ai/interviews/types/interviews.types'

//  Shared hook for ?id= URL state 

export function useAIParams() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  const selectedId = searchParams.get('id') ? Number(searchParams.get('id')) : null

  const selectItem = useCallback((id: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('id', String(id))
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  const clearSelection = useCallback(() => {
    router.replace('?', { scroll: false })
  }, [router])

  return { selectedId, selectItem, clearSelection }
}

//  Tabs 

function AITabs() {
  const pathname = usePathname()
  const isCurricula  = pathname === ROUTES.curricula
  const isInterviews = pathname === ROUTES.interviews

  return (
    <div className="flex border-b border-neutral-200 dark:border-neutral-800 shrink-0">
      <a
        href={ROUTES.curricula}
        className={cn(
          'flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold border-b-2 transition-colors',
          isCurricula
            ? 'border-brand-500 text-brand-600 dark:text-brand-400'
            : 'border-transparent text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300',
        )}
      >
        <FileText className="w-3.5 h-3.5" />
        Currículums
      </a>
      <a
        href={ROUTES.interviews}
        className={cn(
          'flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold border-b-2 transition-colors',
          isInterviews
            ? 'border-brand-500 text-brand-600 dark:text-brand-400'
            : 'border-transparent text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300',
        )}
      >
        <MessageSquare className="w-3.5 h-3.5" />
        Entrevistas
      </a>
    </div>
  )
}

//  Curricula list 

function CurriculaList({
  selectedId,
  onSelect,
}: {
  selectedId: number | null
  onSelect:   (id: number) => void
}) {
  const { data: curricula = [], isLoading } = useCurricula()

  if (isLoading) {
    return (
      <div className="p-4 space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800" />
        ))}
      </div>
    )
  }

  if (curricula.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
          <FileText className="w-6 h-6 text-neutral-400" />
        </div>
        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Sin currículums
        </p>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Desde <a href={ROUTES.jobs} className="underline text-brand-500 hover:text-brand-600">Empleos</a>, elegí una oferta y presioná "CV personalizado".
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
      {curricula.map((cv: GeneratedCurriculumResponse) => (
        <button
          key={cv.id}
          onClick={() => onSelect(cv.id)}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors',
            selectedId === cv.id
              ? 'bg-brand-50 dark:bg-brand-900/20'
              : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
          )}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg,#A855F7,#6366F1)' }}
          >
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
              {cv.jobOfferTitle ?? 'Currículum general'}
            </p>
            <p className="text-xs text-neutral-400 mt-0.5">{formatDate(cv.createdAt)}</p>
          </div>
          <ChevronRight className={cn(
            'w-3.5 h-3.5 shrink-0 transition-colors',
            selectedId === cv.id ? 'text-brand-500' : 'text-neutral-300 dark:text-neutral-600',
          )} />
        </button>
      ))}
    </div>
  )
}

//  Interviews list 

function InterviewsList({
  selectedId,
  onSelect,
}: {
  selectedId: number | null
  onSelect:   (id: number) => void
}) {
  const { data: interviews = [], isLoading } = useInterviews()

  if (isLoading) {
    return (
      <div className="p-4 space-y-3 animate-pulse">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800" />
        ))}
      </div>
    )
  }

  if (interviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
          <MessageSquare className="w-6 h-6 text-neutral-400" />
        </div>
        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Sin entrevistas
        </p>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Desde <a href={ROUTES.jobs} className="underline text-brand-500 hover:text-brand-600">Empleos</a>, elegí una oferta y presioná "Entrevista IA".
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
      {interviews.map((iv: SimulatedInterviewResponse) => {
        const isCompleted = iv.status === 'COMPLETED'
        return (
          <button
            key={iv.id}
            onClick={() => onSelect(iv.id)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors',
              selectedId === iv.id
                ? 'bg-brand-50 dark:bg-brand-900/20'
                : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
            )}
          >
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
              isCompleted ? 'bg-success-50 dark:bg-green-900/20' : 'bg-ai-50 dark:bg-ai-900/20',
            )}>
              {isCompleted
                ? <CheckCircle2 className="w-4 h-4 text-success-500" />
                : <Clock className="w-4 h-4 text-ai-500" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                {iv.jobOfferTitle ?? 'Entrevista'}
              </p>
              <p className={cn(
                'text-xs mt-0.5',
                isCompleted ? 'text-success-500 dark:text-success-400' : 'text-ai-500 dark:text-ai-400',
              )}>
                {isCompleted ? 'Completada' : 'En progreso'}
                {' · '}{formatDate(iv.createdAt)}
              </p>
            </div>
            <ChevronRight className={cn(
              'w-3.5 h-3.5 shrink-0 transition-colors',
              selectedId === iv.id ? 'text-brand-500' : 'text-neutral-300 dark:text-neutral-600',
            )} />
          </button>
        )
      })}
    </div>
  )
}

//  AILeftPanel 

interface AILeftPanelProps {
  section:   'curricula' | 'interviews'
  selectedId: number | null
  onSelect:   (id: number) => void
}

export function AILeftPanel({ section, selectedId, onSelect }: AILeftPanelProps) {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900">
      <AITabs />
      <div className="flex-1 min-h-0 overflow-y-auto">
        {section === 'curricula'
          ? <CurriculaList selectedId={selectedId} onSelect={onSelect} />
          : <InterviewsList selectedId={selectedId} onSelect={onSelect} />
        }
      </div>
    </div>
  )
}
