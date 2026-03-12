'use client'

import { Search } from 'lucide-react'
import { JobListPanel } from './JobListPanel'
import { JobDetailPanel } from './JobDetailPanel'
import { JobDescriptionSide } from './JobDescriptionSide'
import { JobCVPanel } from './JobCVPanel'
import { JobInterviewPanel } from './JobInterviewPanel'
import { useJobsParams } from '../hooks/useJobsParams'
import { cn } from '@/lib/utils/cn'

//  States 
//
//  Mobile (<lg):
//    !selectedId           → list (full width)
//    selectedId, !isAIMode → detail (full width, back → list)
//    selectedId, isAIMode  → description (top) + AI panel (bottom), stacked
//
//  Desktop (lg+):
//    !selectedId           → list (38%) + empty hint (62%)
//    selectedId, !isAIMode → list (38%) + detail (62%)
//    selectedId, isAIMode  → description (42%) + AI panel (58%)
//
// 


// Routes to the correct AI panel based on current mode.
// Kept here (not in a separate file) because it's a 3-line selector — not worth a file.
function JobAIRouter() {
  const { mode } = useJobsParams()
  if (mode === 'cv')        return <JobCVPanel />
  if (mode === 'interview') return <JobInterviewPanel />
  return null
}

export function JobsPageContent() {
  const { selectedId, isAIMode } = useJobsParams()

  return (
    <div className="flex h-full overflow-hidden">

      {/*  Left panel  */}
      <div className={cn(
        'flex-col overflow-hidden border-r border-neutral-200 dark:border-neutral-800',
        // Mobile: hide list when viewing a job; show description stacked on AI mode
        isAIMode
          ? 'hidden lg:flex lg:w-[42%] lg:border-r'           // AI: description side (desktop only, mobile stacks)
          : selectedId !== null
            ? 'hidden lg:flex lg:w-[38%]'                      // detail: list hidden on mobile
            : 'flex w-full lg:w-[38%]',                        // no selection: full on mobile, 38% on desktop
      )}>
        {isAIMode
          ? <JobDescriptionSide />
          : <JobListPanel />
        }
      </div>

      {/*  Right panel  */}

      {/* No selection — desktop empty hint */}
      {selectedId === null && (
        <div className="hidden lg:flex flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-950">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3">
              <Search className="w-7 h-7 text-neutral-300 dark:text-neutral-600" />
            </div>
            <p className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
              Seleccioná una oferta para ver los detalles
            </p>
          </div>
        </div>
      )}

      {/* Job selected — detail or AI */}
      {selectedId !== null && (
        <>
          {/* Mobile: when AI mode, stack description on top */}
          {isAIMode && (
            <div className="lg:hidden flex flex-col flex-1 overflow-hidden">
              {/* Compact description at top — collapsible feel */}
              <div className="shrink-0 max-h-[35vh] overflow-y-auto border-b border-neutral-200 dark:border-neutral-800">
                <JobDescriptionSide />
              </div>
              {/* AI panel fills the rest */}
              <div className="flex-1 overflow-hidden">
                <JobAIRouter />
              </div>
            </div>
          )}

          {/* Detail panel (all sizes when not AI mode) */}
          {!isAIMode && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <JobDetailPanel />
            </div>
          )}

          {/* AI panel (desktop: right side) */}
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
