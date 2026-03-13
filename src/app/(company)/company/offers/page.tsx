
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Plus, Users, Pencil, Trash2, MoreHorizontal,
  Loader2, ChevronDown, ListChecks, Eye,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { EmptyState } from '@/components/shared/feedback/EmptyState'
import { Pagination } from '@/components/shared/data/Pagination'
import {
  useMyJobOffers,
  useDeleteJobOffer,
  useUpdateJobOfferStatus,
} from '@/features/jobs/hooks/useJobOffers'
import { useOfferApplicationCount } from '@/features/applications/hooks/useJobApplications'
import { ROUTES } from '@/config/routes'
import { formatDate } from '@/lib/utils/date'
import { cn } from '@/lib/utils/cn'
import type { JobOfferSummaryResponse } from '@/features/jobs/types/jobs.types'

//  Status config 

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-success-50 text-success-600 dark:bg-green-900/20 dark:text-green-400',
  DRAFT:  'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
  CLOSED: 'bg-danger-50 text-danger-500 dark:bg-red-900/20 dark:text-red-400',
}
const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Activa',
  DRAFT:  'Borrador',
  CLOSED: 'Cerrada',
}

//  Applicant count badge

function ApplicantCount({ offerId }: { offerId: number }) {
  const { data, isLoading } = useOfferApplicationCount(offerId)

  if (isLoading) {
    return (
      <span className="inline-block w-6 h-4 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
    )
  }

  const count = data?.totalElements ?? 0

  return (
    <Link
      href={ROUTES.offerApplications(offerId)}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-brand-50 dark:hover:bg-brand-900/20 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
      title="Ver postulantes"
    >
      <Users className="w-3.5 h-3.5" />
      {count}
    </Link>
  )
}

//  Offer row 

function OfferRow({ offer }: { offer: JobOfferSummaryResponse }) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)

  const { mutate: deleteOffer,  isPending: deleting  } = useDeleteJobOffer()
  const { mutate: updateStatus, isPending: updatingStatus } = useUpdateJobOfferStatus()

  const otherStatuses = (['ACTIVE', 'DRAFT', 'CLOSED'] as const).filter(
    (s) => s !== offer.status,
  )

  function handleDelete() {
    if (confirm(`¿Eliminar "${offer.title}"? Esta acción no se puede deshacer.`)) {
      deleteOffer(offer.id)
    }
    setMenuOpen(false)
  }

  return (
    // No overflow-hidden here — dropdowns need to escape the row
    <div className="flex items-center gap-3 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group">

      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
          {offer.title}
        </p>
        <p className="text-xs text-neutral-400 mt-0.5">
          Publicada {formatDate(offer.createdAt)}
          {offer.location && ` · ${offer.location}`}
        </p>
      </div>

      {/* Applicant count */}
      <div className="shrink-0">
        <ApplicantCount offerId={offer.id} />
      </div>

      {/* Status changer */}
      <div className="relative shrink-0">
        <button
          onClick={() => setStatusOpen((o) => !o)}
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
            STATUS_STYLES[offer.status],
          )}
        >
          {STATUS_LABELS[offer.status]}
          <ChevronDown className="w-3 h-3" />
        </button>

        {statusOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setStatusOpen(false)} />
            <div className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-modal py-1 min-w-[130px]">
              {otherStatuses.map((s) => (
                <button
                  key={s}
                  onClick={() => { updateStatus({ id: offer.id, status: s }); setStatusOpen(false) }}
                  disabled={updatingStatus}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-2 disabled:opacity-50"
                >
                  {updatingStatus
                    ? <Loader2 className="w-3 h-3 animate-spin" />
                    : <span className={cn('w-2 h-2 rounded-full shrink-0',
                        s === 'ACTIVE' ? 'bg-success-500' :
                        s === 'CLOSED' ? 'bg-danger-500'  : 'bg-neutral-400',
                      )} />
                  }
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* More actions */}
      <div className="relative shrink-0">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-modal py-1 min-w-[150px]">
              <button
                onClick={() => { router.push(ROUTES.offerApplications(offer.id)); setMenuOpen(false) }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-2"
              >
                <Users className="w-3.5 h-3.5" />
                Ver postulantes
              </button>
              <button
                onClick={() => { router.push(ROUTES.editOffer(offer.id)); setMenuOpen(false) }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-2"
              >
                <Eye className="w-3.5 h-3.5" />
                Ver oferta
              </button>
              <button
                onClick={() => { router.push(ROUTES.editOffer(offer.id)); setMenuOpen(false) }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-2"
              >
                <Pencil className="w-3.5 h-3.5" />
                Editar oferta
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full text-left px-3 py-2 text-sm hover:bg-danger-50 dark:hover:bg-red-900/20 text-danger-500 flex items-center gap-2 disabled:opacity-50"
              >
                {deleting
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Trash2 className="w-3.5 h-3.5" />
                }
                Eliminar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

//  Page 

export default function CompanyOffersPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useMyJobOffers(page)

  return (
    <div>
      <PageHeader
        title="Mis Ofertas"
        description="Gestioná tus publicaciones de trabajo"
        actions={
          <Link
            href={ROUTES.newOffer}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva oferta
          </Link>
        }
      />

      {/*
        No overflow-hidden on the card — rows have absolute dropdowns that need
        to escape the container. Rounded corners are preserved with rounded-xl.
      */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-card">

        {isLoading && (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4" />
                </div>
                <div className="h-6 w-8 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
                <div className="h-6 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                <div className="h-7 w-6  bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && data?.content.length === 0 && (
          <EmptyState
            icon={ListChecks}
            title="No publicaste ofertas aún"
            description="Creá tu primera oferta y empezá a recibir postulaciones."
            action={{ label: 'Crear oferta', href: ROUTES.newOffer }}
          />
        )}

        {!isLoading && (data?.content.length ?? 0) > 0 && (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {data!.content.map((offer) => (
              <OfferRow key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </div>

      {data && data.totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            totalElements={data.totalElements}
            onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0 }) }}
          />
        </div>
      )}
    </div>
  )
}
