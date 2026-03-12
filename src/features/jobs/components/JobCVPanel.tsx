// Right panel for AI mode = 'cv'.
// Auto-generates a CV for the selected job on mount (or shows existing one).

'use client'

import { useEffect, useRef, useState } from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'
import { useCurricula, useGenerateCurriculum } from '@/features/ai/curricula/hooks/useCurricula'
import { CurriculumDisplay } from '@/features/ai/curricula/components/CurriculumDisplay'
import { useJobsParams } from '../hooks/useJobsParams'
import type { GeneratedCurriculumResponse } from '@/features/ai/curricula/types/curricula.types'

//  Generating skeleton 

function GeneratingSkeleton() {
  return (
    <div className="p-5">
      <div className="flex items-center gap-2 mb-5">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center animate-pulse shrink-0"
          style={{ background: 'linear-gradient(135deg,#A855F7,#6366F1)' }}
        >
          <Sparkles className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm font-medium text-ai-600 dark:text-ai-400 animate-pulse">
          Generando tu currículum personalizado…
        </span>
      </div>
      <div className="space-y-2.5">
        {[88, 75, 92, 68, 80, 60].map((w, i) => (
          <div
            key={i}
            className="h-3 rounded-lg animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
      <div className="mt-6 space-y-2.5">
        <div className="h-2 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse w-1/4" />
        {[95, 82, 70].map((w, i) => (
          <div
            key={i}
            className="h-3 rounded-lg animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    </div>
  )
}

//  Panel 

export function JobCVPanel() {
  const { selectedId } = useJobsParams()
  const jobOfferId     = selectedId!   // Parent ensures selectedId is non-null in AI mode

  const { data: curricula = [], isLoading: loadingList } = useCurricula()
  const { mutate: generate, isPending: generating }      = useGenerateCurriculum()

  // Track the curriculum shown in this panel session
  const [current, setCurrent] = useState<GeneratedCurriculumResponse | null>(null)

  // Prevent double-fire in StrictMode
  const triggered = useRef(false)

  useEffect(() => {
    if (loadingList) return
    if (triggered.current) return

    // Check if there's an existing CV for this job
    const existing = curricula.find((c) => c.jobOfferId === jobOfferId) ?? null

    if (existing) {
      setCurrent(existing)
    } else {
      // Auto-generate
      triggered.current = true
      generate(
        { jobOfferId },
        {
          onSuccess: (cv) => setCurrent(cv),
          // On error: triggered stays true — don't retry silently
        },
      )
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingList])

  // Reset when job changes
  useEffect(() => {
    triggered.current = false
    setCurrent(null)
  }, [jobOfferId])

  function handleRegenerate() {
    triggered.current = true
    setCurrent(null)
    generate(
      { jobOfferId },
      { onSuccess: (cv) => setCurrent(cv) },
    )
  }

  const isLoading = loadingList || (generating && !current)

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg,#A855F7,#6366F1)' }}
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            CV personalizado con IA
          </span>
        </div>

        {current && (
          <button
            onClick={handleRegenerate}
            disabled={generating}
            className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${generating ? 'animate-spin' : ''}`} />
            Regenerar
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {isLoading
          ? <GeneratingSkeleton />
          : current
            ? (
              <div className="px-5 py-4">
                <CurriculumDisplay content={current.content} compact />
              </div>
            )
            : (
              // Error state — generation failed
              <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  No se pudo generar el currículum. Verificá que tu perfil esté completo.
                </p>
                <button
                  onClick={handleRegenerate}
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-xl text-white text-sm font-medium hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,#A855F7,#6366F1)' }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Reintentar
                </button>
              </div>
            )
        }
      </div>
    </div>
  )
}
