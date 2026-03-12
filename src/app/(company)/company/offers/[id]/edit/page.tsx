'use client'

import { use } from 'react'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { JobOfferForm } from '@/features/company/components/JobOfferForm'
import { useJobOffer } from '@/features/jobs/hooks/useJobOffers'
import { PageSkeleton } from '@/components/shared/feedback/PageSkeleton'

interface EditOfferPageProps {
  params: Promise<{ id: string }>
}

export default function EditOfferPage({ params }: EditOfferPageProps) {
  const { id } = use(params)
  const offerId = Number(id)

  const { data: offer, isLoading } = useJobOffer(offerId)

  if (isLoading) return <PageSkeleton /> // REVISAR si es el skeleton más adecuado

  return (
    <div>
      <PageHeader
        title="Editar oferta"
        description={offer?.title ?? ''}
      />
      {offer && <JobOfferForm initial={offer} />}
    </div>
  )
}
