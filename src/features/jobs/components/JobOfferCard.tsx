'use client'

import type { ReactNode } from 'react'
import { MapPin, Clock, Wifi, Building } from 'lucide-react'
import { WORK_MODE_LABELS, JOB_TYPE_LABELS } from '@/config/constants'
import { formatRelative } from '@/lib/utils/date'
import type { JobOfferSummaryResponse } from '../types/jobs.types'
import { cn } from '@/lib/utils/cn'

const WORK_MODE_ICONS = {
  REMOTE:  <Wifi      className="w-3 h-3" />,
  HYBRID:  <Building  className="w-3 h-3" />,
  ON_SITE: <Building  className="w-3 h-3" />,
} as const

const WORK_MODE_COLORS: Record<string, string> = {
  REMOTE:  'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400',
  HYBRID:  'bg-warning-50 text-warning-600',
  ON_SITE: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400',
}

interface JobOfferCardProps {
  offer:     JobOfferSummaryResponse
  selected?: boolean
  onClick?:  () => void
  // Optional slot for extra action buttons (save, unsave, etc.)
  actions?:  ReactNode
}

export function JobOfferCard({
  offer,
  selected = false,
  onClick,
  actions,
}: JobOfferCardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={cn(
        'group relative flex flex-col gap-3 p-4 rounded-xl border transition-all duration-150',
        onClick ? 'cursor-pointer' : '',
        selected
          ? 'border-brand-400 dark:border-brand-500 bg-brand-50/60 dark:bg-brand-900/10 shadow-md'
          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-card hover:shadow-card-hover hover:border-neutral-300 dark:hover:border-neutral-700',
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={cn(
            'text-sm font-semibold truncate',
            selected
              ? 'text-brand-700 dark:text-brand-300'
              : 'text-neutral-900 dark:text-neutral-100',
          )}>
            {offer.title}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
            {offer.companyName ?? 'Empresa'}
          </p>
        </div>

        {/* Selected indicator */}
        {selected && (
          <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-1.5" />
        )}
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-2">
        {offer.location && (
          <span className="inline-flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
            <MapPin className="w-3 h-3" />
            {offer.location}
          </span>
        )}

        {offer.workMode && (
          <span className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
            WORK_MODE_COLORS[offer.workMode],
          )}>
            {WORK_MODE_ICONS[offer.workMode as keyof typeof WORK_MODE_ICONS]}
            {WORK_MODE_LABELS[offer.workMode]}
          </span>
        )}

        {offer.jobType && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
            <Clock className="w-3 h-3" />
            {JOB_TYPE_LABELS[offer.jobType]}
          </span>
        )}
      </div>

      {/* Skills */}
      {offer.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {offer.skills.slice(0, 4).map((skill) => (
            <span
              key={skill.id}
              className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-600 dark:text-neutral-400"
            >
              {skill.name}
            </span>
          ))}
          {offer.skills.length > 4 && (
            <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-400">
              +{offer.skills.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-1">
        <span className="text-xs text-neutral-400 dark:text-neutral-500">
          {formatRelative(offer.createdAt)}
        </span>

        {actions && (
          <div
            className="flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()} // don't trigger card onClick
          >
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

