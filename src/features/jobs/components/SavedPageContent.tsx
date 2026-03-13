// Split-panel layout for /saved.
// Identical structure to JobsPageContent — only difference is the left panel:
// SavedListPanel instead of JobListPanel (no search, feeds from saved-offers API).
'use client'

import { Bookmark } from 'lucide-react'
import { SavedListPanel } from './SavedListPanel'
import { JobDetailPanel } from './JobDetailPanel'
import { JobDescriptionSide } from './JobDescriptionSide'
import { JobCVPanel } from './JobCVPanel'
import { JobInterviewPanel } from './JobInterviewPanel'
import { useJobsParams } from '../hooks/useJobsParams'
import { cn } from '@/lib/utils/cn'

function JobAIRouter() {
  const { mode } = useJobsParams('/saved')
  if (mode === 'cv')        return <JobCVPanel />
  if (mode === 'interview') return <JobInterviewPanel />
  return null
}

export function SavedPageContent() {
  const { selectedId, isAIMode } = useJobsParams('/saved')

  return (
    <div className="flex h-full overflow-hidden">

      {/*  Left panel  */}
      <div className={cn(
        'flex-col overflow-hidden border-r border-neutral-200 dark:border-neutral-800',
        isAIMode
          ? 'hidden lg:flex lg:w-[42%] lg:border-r'
          : selectedId !== null
            ? 'hidden lg:flex lg:w-[38%]'
            : 'flex w-full lg:w-[38%]',
      )}>
        {isAIMode
          ? <JobDescriptionSide />
          : <SavedListPanel />
        }
      </div>

      {/*  Right panel — no selection  */}
      {selectedId === null && (
        <div className="hidden lg:flex flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-950">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3">
              <Bookmark className="w-7 h-7 text-neutral-300 dark:text-neutral-600" />
            </div>
            <p className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
              Seleccioná una oferta para ver los detalles
            </p>
          </div>
        </div>
      )}

      {/*  Right panel — job selected  */}
      {selectedId !== null && (
        <>
          {/* Mobile AI mode: stack description + AI panel */}
          {isAIMode && (
            <div className="lg:hidden flex flex-col flex-1 overflow-hidden">
              <div className="shrink-0 max-h-[35vh] overflow-y-auto border-b border-neutral-200 dark:border-neutral-800">
                <JobDescriptionSide />
              </div>
              <div className="flex-1 overflow-hidden">
                <JobAIRouter />
              </div>
            </div>
          )}

          {/* Detail panel */}
          {!isAIMode && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <JobDetailPanel />
            </div>
          )}

          {/* AI panel (desktop) */}
          {isAIMode && (
            <div className="hidden lg:flex flex-1 flex-col overflow-hidden">
              <JobAIRouter />
            </div>
          )}
        </>
      )}
    </div>
  )
}
