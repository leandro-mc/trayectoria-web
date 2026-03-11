'use client'

import { useState } from 'react'
import {
  ArrowLeft, MapPin, Briefcase, Wifi, Calendar,
  Sparkles, MessageSquare, FileText,
} from 'lucide-react'
import { useJobOffer } from '../hooks/useJobOffers'
import { useJobsParams } from '../hooks/useJobsParams'
import { SaveButton } from './SaveButton'
import { ApplyButton } from './ApplyButton'
import { useAuthStore } from '@/stores/auth.store'
import { WORK_MODE_LABELS, JOB_TYPE_LABELS } from '@/config/constants'
import { formatDate } from '@/lib/utils/date'
import { cn } from '@/lib/utils/cn'

//  Content section tabs 

type TabKey = 'description' | 'responsibilities' | 'requirements' | 'benefits'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'description',      label: 'Descripción'       },
  { key: 'responsibilities', label: 'Responsabilidades' },
  { key: 'requirements',     label: 'Requisitos'        },
  { key: 'benefits',         label: 'Beneficios'        },
]

//  Skeleton 

function DetailSkeleton() {
  return (
    <div className="p-6 animate-pulse space-y-4">
      <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3" />
      <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
      <div className="flex gap-2 mt-4">
        {[60, 80, 70].map((w) => (
          <div key={w} className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded-full" style={{ width: `${w}px` }} />
        ))}
      </div>
      <div className="space-y-2 mt-6">
        {[100, 90, 95, 85, 100].map((w, i) => (
          <div key={i} className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  )
}

//  Component 

export function JobDetailPanel() {
  const [activeTab, setActiveTab] = useState<TabKey>('description')
  const { selectedId, setMode, goBackToList } = useJobsParams()
  const isCandidate = useAuthStore((s) => s.user?.role === 'CANDIDATE')

  // selectedId is number | null — useJobOffer handles null via enabled: id !== null
  const { data: offer, isLoading, error } = useJobOffer(selectedId)

  //  Loading 
  if (isLoading) return <DetailSkeleton />

  //  Error / not found 
  if (error || !offer) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          No se pudo cargar la oferta
        </p>
        <button
          onClick={goBackToList}
          className="mt-3 text-xs text-brand-500 hover:text-brand-600 transition-colors"
        >
          Volver a la lista
        </button>
      </div>
    )
  }

  const tabContent: Record<TabKey, string | null> = {
    description:      offer.description,
    responsibilities: offer.responsibilities,
    requirements:     offer.requirements,
    benefits:         offer.benefits,
  }

  // Only show tabs that have content
  const availableTabs = TABS.filter((t) => tabContent[t.key])

  // If current tab lost content after data reload, reset to first available
  const resolvedTab = tabContent[activeTab]
    ? activeTab
    : (availableTabs[0]?.key ?? 'description')

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/*  Sticky header  */}
      <div className="shrink-0 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-5 pt-4 pb-0">

        {/* Mobile back button */}
        <button
          onClick={goBackToList}
          className="lg:hidden inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver a la lista
        </button>

        {/* Company + title */}
        <div className="mb-3">
          <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 mb-1">
            {offer.companyName ?? 'Empresa'}
          </p>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
            {offer.title}
          </h2>
        </div>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {offer.location && (
            <span className="inline-flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
              <MapPin className="w-3.5 h-3.5" />
              {offer.location}
            </span>
          )}
          {offer.workMode && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400">
              <Wifi className="w-3 h-3" />
              {WORK_MODE_LABELS[offer.workMode]}
            </span>
          )}
          {offer.jobType && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
              <Briefcase className="w-3 h-3" />
              {JOB_TYPE_LABELS[offer.jobType]}
            </span>
          )}
          {offer.expiresAt && (
            <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
              <Calendar className="w-3 h-3" />
              Cierra {formatDate(offer.expiresAt)}
            </span>
          )}
        </div>

        {/* Skills */}
        {offer.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {offer.skills.map((skill) => (
              <span
                key={skill.id}
                className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400"
              >
                {skill.name}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <ApplyButton
            jobOfferId={offer.id}
            jobTitle={offer.title}
            companyName={offer.companyName}
            offerStatus={offer.status}
          />

          <SaveButton jobOfferId={offer.id} size="md" showLabel />

          {isCandidate && (
            <>
              <button
                onClick={() => setMode('cv')}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium border border-ai-300 dark:border-ai-800 text-ai-600 dark:text-ai-400 hover:bg-ai-50 dark:hover:bg-ai-900/20 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                CV personalizado
              </button>
              <button
                onClick={() => setMode('interview')}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium border border-ai-300 dark:border-ai-800 text-ai-600 dark:text-ai-400 hover:bg-ai-50 dark:hover:bg-ai-900/20 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Entrevista IA
              </button>
            </>
          )}
        </div>

        {/* Content tabs */}
        {availableTabs.length > 1 && (
          <div className="flex -mb-px">
            {availableTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'px-4 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap',
                  resolvedTab === tab.key
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/*  Scrollable content  */}
      <div className="flex-1 overflow-y-auto px-5 py-5 bg-white dark:bg-neutral-900">
        {availableTabs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mb-2" />
            <p className="text-sm text-neutral-400">
              Esta oferta no tiene descripción detallada
            </p>
          </div>
        ) : (
          tabContent[resolvedTab] ? (
            <div className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
              {tabContent[resolvedTab]}
            </div>
          ) : (
            <p className="text-sm text-neutral-400 italic">
              Sin información en esta sección
            </p>
          )
        )}
      </div>
    </div>
  )
}
