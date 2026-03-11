'use client'

import { useState } from 'react'
import { Briefcase } from 'lucide-react'
import { JobOfferCard } from '@/features/jobs/components/JobOfferCard'
import { JobOfferFilters } from '@/features/jobs/components/JobOfferFilters'
import { useJobOffers } from '@/features/jobs/hooks/useJobOffers'
import { CardSkeleton } from '@/components/shared/feedback/PageSkeleton'
import { InlineError } from '@/components/shared/feedback/ErrorBoundary'
import { EmptyState } from '@/components/shared/feedback/EmptyState'
import { Pagination } from '@/components/shared/data/Pagination'
import { extractApiError } from '@/lib/utils/format'
import type { ListJobOffersParams } from '@/features/jobs/types/jobs.types'

export default function PublicJobsPage() {
  const [filters, setFilters] = useState<ListJobOffersParams>({ page: 0 })

  const { data, isLoading, isError, error, refetch } = useJobOffers(filters)

  function handleFiltersChange(next: ListJobOffersParams) {
    setFilters(next)
  }

  function handlePageChange(page: number) {
    setFilters((f) => ({ ...f, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/*  Page header  */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
            Ofertas de trabajo
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Encontrá tu próxima oportunidad laboral
          </p>
        </div>

        {/*  Layout: filters + grid  */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Filters sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-card lg:sticky lg:top-6">
              <JobOfferFilters filters={filters} onChange={handleFiltersChange} />
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">

            {/* Count */}
            {data && !isLoading && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                {data.totalElements}{' '}
                {data.totalElements === 1 ? 'oferta encontrada' : 'ofertas encontradas'}
              </p>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Error */}
            {isError && (
              <InlineError
                message={extractApiError(error)}
                onRetry={() => void refetch()}
              />
            )}

            {/* Empty */}
            {!isLoading && !isError && data?.content.length === 0 && (
              <EmptyState
                icon={Briefcase}
                title="No hay ofertas disponibles"
                description="No encontramos ofertas con esos filtros. Probá con otros criterios."
                action={{
                  label:   'Limpiar filtros',
                  onClick: () => setFilters({ page: 0 }),
                }}
              />
            )}

            {/* Grid */}
            {!isLoading && !isError && (data?.content.length ?? 0) > 0 && (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
                  {data!.content.map((offer) => (
                    <JobOfferCard key={offer.id} offer={offer} />
                  ))}
                </div>

                <Pagination
                  page={data!.page}
                  totalPages={data!.totalPages}
                  totalElements={data!.totalElements}
                  onPageChange={handlePageChange}
                />
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
