'use client'

import type { ReactNode } from 'react'
import { CandidateSidebar } from '@/components/shared/layout/CandidateSidebar'
import { MobileBottomNav } from '@/components/shared/layout/MobileBottomNav'
import { PublicNavbar } from '@/components/shared/layout/PublicNavbar'
import { useAuthStore } from '@/stores/auth.store'
import { CompanySidebar } from '@/components/shared/layout/CompanySidebar'

// Jobs is accessible to everyone.
// - CANDIDATE   -> full candidate shell with sidebar (panel fijo, acciones activas)
// - COMPANY     -> public navbar (pueden ver ofertas, no postularse)
// - No auth     -> public navbar (pueden ver, se les pide login al actuar)

interface JobsShellProps {
  children: ReactNode
}

export function JobsShell({ children }: JobsShellProps) {
  const role = useAuthStore((s) => s.user?.role)
  const isCandidate = role === 'CANDIDATE'
  const isCompany   = role === 'COMPANY'

  if (isCandidate || isCompany) {
    return (
      <div className="flex h-dvh bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
        {isCompany ? <CompanySidebar /> : <CandidateSidebar />}        
         {/*
          flex-col so MobileBottomNav sits at the bottom in normal flow.
          The split panels (JobListPanel, JobDetailPanel) handle their own scroll internally.
        */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <div className="flex-1 min-w-0 overflow-hidden">
            {children}
          </div>
          <MobileBottomNav />
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
      <PublicNavbar />
      <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  )
}
