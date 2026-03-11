'use client'

import type { ReactNode } from 'react'
import { CandidateSidebar } from '@/components/shared/layout/CandidateSidebar'
import { MobileBottomNav } from '@/components/shared/layout/MobileBottomNav'
import { PublicNavbar } from '@/components/shared/layout/PublicNavbar'
import { useAuthStore } from '@/stores/auth.store'

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

  if (isCandidate) {
    return (
      <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
        <CandidateSidebar />
        {/* No padding, no max-width — the split panel fills the space */}
        <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
          {children}
        </div>
        <MobileBottomNav />
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
