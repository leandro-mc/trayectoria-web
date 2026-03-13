'use client'


import { use, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Users, ChevronDown, Loader2, Search } from 'lucide-react'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { EmptyState } from '@/components/shared/feedback/EmptyState'
import { Pagination } from '@/components/shared/data/Pagination'
import {
  useJobApplications,
  useUpdateApplicationStatus,
} from '@/features/applications/hooks/useJobApplications'
import { CandidateProfilePanel } from '@/features/applications/components/CandidateProfilePanel'
import { useJobOffer } from '@/features/jobs/hooks/useJobOffers'
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
} from '@/config/constants'
import { formatDate } from '@/lib/utils/date'
import { ROUTES } from '@/config/routes'
import { cn } from '@/lib/utils/cn'
import type { JobApplicationResponse } from '@/features/applications/types/applications.types'
import type { ApplicationStatus } from '@/types/global.types'

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

function ApplicationRow({
  application,
  isSelected,
  onSelect,
}: {
  application: JobApplicationResponse
  isSelected:  boolean
  onSelect:    () => void
}) {
  const [statusOpen, setStatusOpen] = useState(false)
  const { mutate: updateStatus, isPending } = useUpdateApplicationStatus()

  const candidateName = [
    application.candidateFirstName,
    application.candidateLastName,
  ].filter(Boolean).join(' ') || application.candidateEmail || `Candidato #${application.candidateId}`

  const availableStatuses = NEXT_STATUSES.filter((s) => s !== application.status)

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3.5 transition-colors cursor-pointer',
        isSelected
          ? 'bg-brand-50 dark:bg-brand-900/20'
          : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
      )}
      onClick={onSelect}
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-xs font-bold text-brand-600 dark:text-brand-400 shrink-0">
        {(application.candidateFirstName?.[0] ?? application.candidateEmail?.[0] ?? '?').toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
          {candidateName}
        </p>
        <p className="text-xs text-neutral-400 mt-0.5">
          {formatDate(application.appliedAt)}
          {application.curriculumId && (
            <span className="ml-1.5 text-ai-500 font-medium">· CV ✨</span>
          )}
        </p>
      </div>

      {/* Status dropdown — stopPropagation so click doesn't also select the row */}
      <div
        className="relative shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setStatusOpen((o) => !o)}
          className={cn(
            'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors',
            APPLICATION_STATUS_COLORS[application.status],
          )}
        >
          {APPLICATION_STATUS_LABELS[application.status]}
          <ChevronDown className="w-3 h-3" />
        </button>

        {statusOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setStatusOpen(false)} />
            <div className="absolute right-0 top-full mt-1 z-40 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-modal py-1 min-w-[150px]">
              {availableStatuses.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    updateStatus({ id: application.id, data: { status: s } })
                    setStatusOpen(false)
                  }}
                  disabled={isPending}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-2.5 disabled:opacity-50"
                >
                  {isPending
                    ? <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                    : <span className={cn(
                        'w-2 h-2 rounded-full shrink-0',
                        s === 'ACCEPTED'  ? 'bg-success-500'  :
                        s === 'REJECTED'  ? 'bg-danger-500'   :
                        s === 'IN_REVIEW' ? 'bg-warning-500'  :
                        s === 'VIEWED'    ? 'bg-brand-400'    :
                        'bg-neutral-400',
                      )}
                    />
                  }
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
  const { id }  = use(params)
  const offerId = Number(id)

  const [page, setPage]           = useState(0)
  const [activeTab, setActiveTab] = useState<ApplicationStatus | 'ALL'>('ALL')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { data: offer }     = useJobOffer(offerId)
  const { data, isLoading } = useJobApplications(offerId, page)

  const filtered = data?.content.filter(
    (a) => activeTab === 'ALL' || a.status === activeTab,
  ) ?? []

  const selectedApp = filtered.find((a) => a.id === selectedId) ?? null

  const handleSelect = useCallback((id: number) => {
    setSelectedId((prev) => prev === id ? null : id)
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 px-1">
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
              onClick={() => { setActiveTab(tab.value); setPage(0); setSelectedId(null) }}
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
      </div>

      {/* Split panel */}
      <div className="flex flex-1 min-h-0 gap-4">

        {/* Left — applicant list */}
        <div className={cn(
          'flex flex-col min-h-0',
          selectedApp ? 'hidden lg:flex lg:w-[40%]' : 'flex w-full lg:w-[40%]',
        )}>
          <div className="flex-1 min-h-0 overflow-y-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">

            {isLoading && (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800 animate-pulse">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                    <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
                      <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
                    </div>
                    <div className="h-5 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-full shrink-0" />
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
                  <ApplicationRow
                    key={app.id}
                    application={app}
                    isSelected={selectedId === app.id}
                    onSelect={() => handleSelect(app.id)}
                  />
                ))}
              </div>
            )}

            {data && data.totalPages > 1 && (
              <div className="p-4 border-t border-neutral-100 dark:border-neutral-800">
                <Pagination
                  page={data.page}
                  totalPages={data.totalPages}
                  totalElements={data.totalElements}
                  onPageChange={(p) => { setPage(p); setSelectedId(null) }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right — candidate profile */}
        {selectedApp ? (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Mobile back */}
            <button
              onClick={() => setSelectedId(null)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 text-xs font-medium text-neutral-500 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-t-xl hover:text-neutral-800 transition-colors shrink-0"
            >
              ← Volver al listado
            </button>
            <div className="flex-1 min-h-0 overflow-hidden border border-neutral-200 dark:border-neutral-800 rounded-xl lg:rounded-xl rounded-tl-none lg:rounded-tl-xl">
              <CandidateProfilePanel application={selectedApp} />
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3">
                <Search className="w-7 h-7 text-neutral-300 dark:text-neutral-600" />
              </div>
              <p className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
                Seleccioná un postulante para ver su perfil
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
