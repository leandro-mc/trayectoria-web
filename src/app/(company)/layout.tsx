import type { ReactNode } from 'react'
import { CompanySidebar } from '@/components/shared/layout/CompanySidebar'

interface CompanyLayoutProps {
  children: ReactNode
}

export default function CompanyLayout({ children }: CompanyLayoutProps) {
  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 overflow-hidden">

      <CompanySidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  )
}
