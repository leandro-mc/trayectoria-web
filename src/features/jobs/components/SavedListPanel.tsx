// Left panel for /saved — list of saved offers.
// No search/filter: the user already curated this list intentionally.
// "Quitar" unsaves without leaving the panel.
'use client'

import { Bookmark, BookmarkX } from 'lucide-react'
import { useSavedOffers, useUnsaveOffer } from '@/features/saved-offers/hooks/useSavedOffers'
import { useJobsParams } from '../hooks/useJobsParams'
import { JobOfferCard } from './JobOfferCard'
import { ROUTES } from '@/config/routes'

//  Skeleton 

function CardSkeleton() {
  return (
    <div className="animate-pulse p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
      <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
      <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
      <div className="flex gap-2">
        <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded-full w-16" />
        <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded-full w-20" />
      </div>
    </div>
  )
}

//  Unsave button 

function UnsaveButton({ jobOfferId, onUnsave }: {
  jobOfferId: number
  onUnsave:   (id: number) => void
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onUnsave(jobOfferId) }}
      title="Quitar de guardadas"
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-danger-300 dark:hover:border-red-700 hover:bg-danger-50 dark:hover:bg-red-900/20 text-neutral-400 hover:text-danger-500 text-xs font-medium transition-colors shrink-0"
    >
      <BookmarkX className="w-3.5 h-3.5" />
      Quitar
    </button>
  )
}

//  Component 

export function SavedListPanel() {
  const { selectedId, page, selectJob, setPage } = useJobsParams('/saved')
  const { data, isLoading }        = useSavedOffers(page)
  const { mutate: unsave, isPending: unsaving } = useUnsaveOffer()

  return (
    <div className="flex flex-col h-full">

      {/*  Header  */}
      <div className="px-3 pt-3 pb-2.5 border-b border-neutral-100 dark:border-neutral-800 shrink-0 bg-white dark:bg-neutral-900">
        <div className="flex items-center gap-2 mb-1">
          <Bookmark className="w-4 h-4 text-brand-500 shrink-0" />
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Ofertas guardadas
          </h2>
        </div>
        <p className="text-xs text-neutral-400">
          {data
            ? `${data.totalElements} oferta${data.totalElements !== 1 ? 's' : ''} guardada${data.totalElements !== 1 ? 's' : ''}`
            : ' '
          }
        </p>
      </div>

      {/*  List  */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">

        {isLoading && (
          Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
        )}

        {!isLoading && data?.content.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3">
              <Bookmark className="w-6 h-6 text-neutral-300 dark:text-neutral-600" />
            </div>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              No tenés ofertas guardadas
            </p>
            <a
              href={ROUTES.jobs}
              className="text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors"
            >
              Explorar ofertas →
            </a>
          </div>
        )}

        {!isLoading && data?.content.map((offer) => (
          <JobOfferCard
            key={offer.id}
            offer={offer}
            selected={selectedId === offer.id}
            onClick={() => selectJob(offer.id)}
            actions={
              <UnsaveButton
                jobOfferId={offer.id}
                onUnsave={(id) => {
                  unsave(id, {
                    onSuccess: () => {
                      // If the unsaved offer was selected, deselect it
                      if (selectedId === id) selectJob(-1)
                    },
                  })
                }}
              />
            }
          />
        ))}
      </div>

      {/*  Pagination  */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100 dark:border-neutral-800 shrink-0 bg-white dark:bg-neutral-900">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>
          <span className="text-xs text-neutral-400">
            {page + 1} / {data.totalPages}
          </span>
          <button
            disabled={data.last}
            onClick={() => setPage(page + 1)}
            className="text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
