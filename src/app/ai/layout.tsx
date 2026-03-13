// AIShell — same structure as JobsShell.
// Full-height split panel with CandidateSidebar + MobileBottomNav.
// Protected by middleware (CANDIDATE_ROUTES includes /ai).
'use client'

import type { ReactNode } from 'react'
import { CandidateSidebar } from '@/components/shared/layout/CandidateSidebar'
import { MobileBottomNav } from '@/components/shared/layout/MobileBottomNav'

export default function AILayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
      <CandidateSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <div className="flex-1 min-w-0 overflow-hidden">
          {children}
        </div>
        <MobileBottomNav />
      </div>
    </div>
  )
}
