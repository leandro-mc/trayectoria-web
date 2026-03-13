'use client'

import { use } from 'react'
import Link from 'next/link'
import { Eye } from 'lucide-react'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { JobOfferForm } from '@/features/company/components/JobOfferForm'
import { useJobOffer, useInterviewInstructions } from '@/features/jobs/hooks/useJobOffers'
import { PageSkeleton } from '@/components/shared/feedback/PageSkeleton'
import { ROUTES } from '@/config/routes'

interface EditOfferPageProps {
  params: Promise<{ id: string }>
}

export default function EditOfferPage({ params }: EditOfferPageProps) {
  const { id } = use(params)
  const offerId = Number(id)

  const { data: offer, isLoading: offerLoading }                  = useJobOffer(offerId)
  const { data: instructions, isLoading: instructionsLoading }    = useInterviewInstructions(offerId)

  // Wait for both — the form needs offer data before it can render,
  // and instructions before it can pre-populate the AI section.
  if (offerLoading || instructionsLoading) return <PageSkeleton />

  return (
    <div>
      <PageHeader
        title="Editar oferta"
        description={offer?.title ?? ''}
        actions={
          <Link
            href={ROUTES.offerDetail(offerId)}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm font-medium transition-colors"
          >
            <Eye className="w-4 h-4" />
            Ver oferta
          </Link>
        }
      />
      {offer && (
        <JobOfferForm
          initial={offer}
          initialInstructions={instructions?.interviewInstructions}
        />
      )}
    </div>
  )
}
