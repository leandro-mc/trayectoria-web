import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SavedPageContent } from '@/features/jobs/components/SavedPageContent'

export const metadata: Metadata = { title: 'Ofertas guardadas' }

export default function SavedPage() {
  return (
    <Suspense>
      <SavedPageContent />
    </Suspense>
  )
}
