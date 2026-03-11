'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Users, ChevronDown, Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { EmptyState } from '@/components/shared/feedback/EmptyState'
import { Pagination } from '@/components/shared/data/Pagination'
import { useJobApplications, useUpdateApplicationStatus } from '@/features/applications/hooks/useJobApplications'
import { useJobOffer } from '@/features/jobs/hooks/useJobOffers'
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
} from '@/config/constants'
import { formatDate } from '@/lib/utils/date'
import { ROUTES } from '@/config/routes'
import type { JobApplicationResponse } from '@/features/applications/types/applications.types'
import type { ApplicationStatus } from '@/types/global.types'
import { cn } from '@/lib/utils/cn'

//  Status filter tabs 

const FILTER_TABS: { label: string; value: ApplicationStatus | 'ALL' }[] = [
  { label: 'Todas',       value: 'ALL'       },
  { label: 'Pendientes',  value: 'PENDING'   },
  { label: 'Vistas',      value: 'VIEWED'    },
  { label: 'En revisión', value: 'IN_REVIEW' },
  { label: 'Aceptadas',   value: 'ACCEPTED'  },
  { label: 'Rechazadas',  value: 'REJECTED'  },
]

// Status transitions available to company
const NEXT_STATUSES: Exclude<ApplicationStatus, 'PENDING'>[] = [
  'VIEWED', 'IN_REVIEW', 'ACCEPTED', 'REJECTED',
]

//  Application row 

function ApplicationRow({ application }: { application: JobApplicationResponse }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { mutate: updateStatus, isPending } = useUpdateApplicationStatus()

  const candidateName = [
    application.candidateFirstName,
    application.candidateLastName,
  ].filter(Boolean).join(' ') || application.candidateEmail || `Candidato #${application.candidateId}`

  const availableStatuses = NEXT_STATUSES.filter((s) => s !== application.status)

  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group">

      {/* Avatar initials */}
      <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-xs font-bold text-brand-600 dark:text-brand-400 shrink-0">
        {candidateName.charAt(0).toUpperCase()}
      </div>

      {/* Candidate info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
          {candidateName}
        </p>
        <p className="text-xs text-neutral-400 mt-0.5">
          Postulado {formatDate(application.appliedAt)}
          {application.updatedAt && (
            <span> · Actualizado {formatDate(application.updatedAt)}</span>
          )}
        </p>
      </div>

      {/* Current status + changer */}
      <div className="relative shrink-0">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
            APPLICATION_STATUS_COLORS[application.status],
          )}
        >
          {APPLICATION_STATUS_LABELS[application.status]}
          <ChevronDown className="w-3 h-3" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-modal py-1 min-w-[150px]">
              {availableStatuses.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    updateStatus({ id: application.id, data: { status: s } })
                    setMenuOpen(false)
                  }}
                  disabled={isPending}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-2 disabled:opacity-50"
                >
                  {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                  <span className={cn(
                    'w-2 h-2 rounded-full shrink-0',
                    s === 'ACCEPTED'  ? 'bg-success-500'  :
                    s === 'REJECTED'  ? 'bg-danger-500'   :
                    s === 'IN_REVIEW' ? 'bg-warning-500'  :
                    'bg-neutral-400',
                  )} />
                  {APPLICATION_STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

//  Page 

interface PageProps {
  params: Promise<{ id: string }>
}

export default function OfferApplicationsPage({ params }: PageProps) {
  const { id } = use(params)
  const offerId = Number(id)

  const [page, setPage]           = useState(0)
  const [activeTab, setActiveTab] = useState<ApplicationStatus | 'ALL'>('ALL')

  const { data: offer }       = useJobOffer(offerId)
  const { data, isLoading }   = useJobApplications(offerId, page)

  const filtered = data?.content.filter(
    (a) => activeTab === 'ALL' || a.status === activeTab,
  ) ?? []

  return (
    <div>
      <PageHeader
        title={offer?.title ?? 'Postulaciones'}
        description={`${data?.totalElements ?? 0} postulación${(data?.totalElements ?? 0) !== 1 ? 'es' : ''} recibida${(data?.totalElements ?? 0) !== 1 ? 's' : ''}`}
        actions={
          <Link
            href={ROUTES.offers}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Mis ofertas
          </Link>
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setActiveTab(tab.value); setPage(0) }}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              activeTab === tab.value
                ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-card overflow-hidden">

        {isLoading && (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4" />
                </div>
                <div className="h-6 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <EmptyState
            icon={Users}
            title="Sin postulaciones"
            description={
              activeTab === 'ALL'
                ? 'Aún no recibiste postulaciones para esta oferta.'
                : 'No hay postulaciones con este estado.'
            }
            action={activeTab !== 'ALL' ? {
              label:   'Ver todas',
              onClick: () => setActiveTab('ALL'),
            } : undefined}
          />
        )}

        {!isLoading && filtered.length > 0 && (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {filtered.map((app) => (
              <ApplicationRow key={app.id} application={app} />
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
