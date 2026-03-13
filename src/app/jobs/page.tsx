import { Suspense } from 'react'
import type { Metadata } from 'next'
import { JobsPageContent } from '@/features/jobs/components/JobsPageContent'


export const metadata: Metadata = { title: 'Ofertas de trabajo' }

// useSearchParams() requires Suspense in Next.js App Router
export default function JobsPage() {
  return (
    <Suspense>
      <JobsPageContent />
    </Suspense>
  )
}
