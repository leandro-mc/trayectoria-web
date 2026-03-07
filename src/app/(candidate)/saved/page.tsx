'use client'

import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { JobOfferCard } from '@/features/jobs/components/JobOfferCard'
import { CardSkeleton } from '@/components/shared/feedback/PageSkeleton'
import { EmptyState } from '@/components/shared/feedback/EmptyState'
import { Pagination } from '@/components/shared/data/Pagination'
import { useSavedOffers, useUnsaveOffer } from '@/features/saved-offers/hooks/useSavedOffers'
import { ROUTES } from '@/config/routes'
import { BookmarkX } from 'lucide-react'

export default function SavedOffersPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useSavedOffers(page)
  const { mutate: unsave, isPending: unsaving } = useUnsaveOffer()

  return (
    <div>
      <PageHeader
        title="Ofertas Guardadas"
        description="Ofertas que marcaste para revisar después"
      />

      {isLoading && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      )}

      {!isLoading && data?.content.length === 0 && (
        <EmptyState
          icon={Bookmark}
          title="No tenés ofertas guardadas"
          description="Guardá ofertas desde el catálogo para revisarlas después."
          action={{ label: 'Explorar ofertas', href: ROUTES.jobs }}
        />
      )}

      {!isLoading && (data?.content.length ?? 0) > 0 && (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
            {data!.content.map((offer) => (
              <JobOfferCard
                key={offer.id}
                offer={offer}
                actions={
                  <button
                    onClick={() => unsave(offer.id)}
                    disabled={unsaving}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-danger-300 dark:hover:border-red-700 hover:bg-danger-50 dark:hover:bg-red-900/20 text-neutral-500 hover:text-danger-500 text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    <BookmarkX className="w-3.5 h-3.5" />
                    Quitar
                  </button>
                }
              />
            ))}
          </div>
          <Pagination
            page={data!.page}
            totalPages={data!.totalPages}
            totalElements={data!.totalElements}
            onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0 }) }}
          />
        </>
      )}
    </div>
  )
}
