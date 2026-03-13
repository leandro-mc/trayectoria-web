import type { ReactNode } from 'react'
import { CompanySidebar } from '@/components/shared/layout/CompanySidebar'
import { MobileBottomNav } from '@/components/shared/layout/MobileBottomNav'

interface CompanyLayoutProps {
  children: ReactNode
}

export default function CompanyLayout({ children }: CompanyLayoutProps) {
  return (
    <div className="flex h-dvh bg-neutral-50 dark:bg-neutral-950 overflow-hidden">

      <CompanySidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        <div className="flex-1 min-h-0 overflow-y-auto">
          <main className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-5xl w-full mx-auto">
            {children}
          </main>
        </div>

        <MobileBottomNav />
      </div>

    </div>
  )
}
