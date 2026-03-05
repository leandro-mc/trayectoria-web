import type { ReactNode } from 'react'
import { CandidateSidebar } from '@/components/shared/layout/CandidateSidebar'
import { MobileBottomNav } from '@/components/shared/layout/MobileBottomNav'

interface CandidateLayoutProps {
  children: ReactNode
}

export default function CandidateLayout({ children }: CandidateLayoutProps) {
  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 overflow-hidden">

      {/* Desktop sidebar */}
      <CandidateSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-6 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />

    </div>
  )
}
