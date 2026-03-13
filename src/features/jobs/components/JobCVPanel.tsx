// Right panel for AI mode = 'cv'.
// Auto-generates a CV for the selected job on mount (or shows existing one).

'use client'

import { useEffect, useRef, useState } from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'
import { useCandidateProfile } from '@/features/candidate/hooks/useCandidate'
import {
  useLatestCurriculum,
  useGenerateCurriculum,
} from '@/features/ai/curricula/hooks/useCurricula'
import { CurriculumDisplay } from '@/features/ai/curricula/components/CurriculumDisplay'
import { useJobsParams } from '../hooks/useJobsParams'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/config/query-keys'

//  Module-level guard 
// Tracks jobOfferIds for which a generate call is already in flight.
// A plain component ref would be reset on React StrictMode's second mount;
// a module-level Set persists for the entire browser session.
// It is cleared on success/error so the user can regenerate if needed.
const generationInFlight = new Set<number>()

//  Loading skeleton 

function GeneratingSkeleton({ label }: { label: string }) {
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
          {label}
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

  const queryClient = useQueryClient()

  // Candidate userId is needed for the /curricula/latest endpoint.
  // Profile is cached after first visit — this rarely makes a network request.
  const { data: profile, isLoading: profileLoading } = useCandidateProfile()
  const candidateId = profile?.userId ?? null

  const {
    data:      latestCV,
    isLoading: loadingLatest,
    isError:   notFound,        // true when backend returns 404
  } = useLatestCurriculum(candidateId, jobOfferId)

  const { mutate: generate, isPending: generating } = useGenerateCurriculum()

  // Only set to true when the generate call itself fails (network error, 500, etc.)
  // — NOT when the CV simply doesn't exist yet. This prevents the error message
  // from flashing while the auto-generate effect hasn't fired yet.
  const [generationFailed, setGenerationFailed] = useState(false)

  // Tracks whether we've kicked off a regenerate in the current session
  const regenRef = useRef(false)

  //  Auto-generate when no CV exists 
  useEffect(() => {
    // Wait until we know whether a CV exists
    if (profileLoading || loadingLatest) return
    // A CV already exists — nothing to do
    if (latestCV) return
    // Only trigger when the query confirmed "not found"
    if (!notFound) return
    // Module-level guard: prevents the second StrictMode mount from firing again
    if (generationInFlight.has(jobOfferId)) return

    generationInFlight.add(jobOfferId)

    generate(
      { jobOfferId },
      {
        onSuccess: () => {
          generationInFlight.delete(jobOfferId)
        },
        onError: () => {
          generationInFlight.delete(jobOfferId)
          setGenerationFailed(true)
        },
      },
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileLoading, loadingLatest, !!latestCV, notFound, jobOfferId])

  //  Reset state when job changes 
  useEffect(() => {
    setGenerationFailed(false)
    regenRef.current = false
  }, [jobOfferId])

  //  Regenerate handler 
  function handleRegenerate() {
    if (generating || regenRef.current) return
    regenRef.current = true
    setGenerationFailed(false)

    generate(
      { jobOfferId },
      {
        onSuccess: () => {
          regenRef.current = false
          if (candidateId != null) {
            void queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.curricula.latest(candidateId, jobOfferId),
            })
          }
        },
        onError: () => {
          regenRef.current = false
          setGenerationFailed(true)
        },
      },
    )
  }

  //  Derived state 
  const showContent  = !!latestCV && !generating
  const showError    = generationFailed && !generating
  const showSkeleton = !showContent && !showError

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

        {showContent && (
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
        {showSkeleton && (
          <GeneratingSkeleton
            label={
              generating
                ? 'Generando tu currículum personalizado…'
                : 'Buscando currículum existente…'
            }
          />
        )}

        {showContent && (
          <div className="px-5 py-4">
            <CurriculumDisplay content={latestCV!.content} compact />
          </div>
        )}

        {showError && (
          <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              No se pudo generar el currículum. Verificá que tu perfil esté completo.
            </p>
            <button
              onClick={handleRegenerate}
              disabled={generating}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-xl text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#A855F7,#6366F1)' }}
            >
              <RefreshCw className="w-4 h-4" />
              Reintentar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

