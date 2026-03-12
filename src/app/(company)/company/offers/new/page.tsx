import type { Metadata } from 'next'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { JobOfferForm } from '@/features/company/components/JobOfferForm'

export const metadata: Metadata = { title: 'Nueva oferta' }

export default function NewOfferPage() {
  return (
    <div>
      <PageHeader
        title="Nueva oferta de trabajo"
        description="Completá los detalles del puesto que querés publicar"
      />
      <JobOfferForm />
    </div>
  )
}
