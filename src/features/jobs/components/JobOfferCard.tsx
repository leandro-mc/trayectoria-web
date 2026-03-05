'use client'

import { Building2, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'
import {
  WORK_MODE_LABELS,
  WORK_MODE_BADGE_STYLES,
  JOB_TYPE_LABELS,
} from '@/config/constants'
import { formatRelative } from '@/lib/utils/date'
import type { JobOfferSummaryResponse } from '../types/jobs.types'

interface JobOfferCardProps {
  offer:       JobOfferSummaryResponse
  // Optional slot for action buttons (save, apply).
  // When undefined the card renders without actions — used in public listing.
  actions?:    React.ReactNode
}

export function JobOfferCard({ offer, actions }: JobOfferCardProps) {
  const {
    id, title, companyName, location,
    workMode, jobType, skills, createdAt,
  } = offer

  return (
    <div className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200">

      {/*  Top: company + title  */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 transition-colors">
          <Building2 className="w-5 h-5 text-neutral-400 group-hover:text-brand-500 transition-colors" />
        </div>

        <div className="flex-1 min-w-0">
          {companyName && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5 truncate">
              {companyName}
            </p>
          )}
          <Link
            href={ROUTES.publicJob(id)}
            className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-2"
          >
            {title}
          </Link>
        </div>
      </div>

      {/*  Meta: location + work mode + job type  */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-3">
        {location && (
          <span className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
            <MapPin className="w-3 h-3 shrink-0" />
            {location}
          </span>
        )}

        {workMode && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${WORK_MODE_BADGE_STYLES[workMode]}`}>
            {WORK_MODE_LABELS[workMode]}
          </span>
        )}

        {jobType && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
            {JOB_TYPE_LABELS[jobType]}
          </span>
        )}
      </div>

      {/*  Skills  */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skills.slice(0, 4).map((skill) => (
            <span
              key={skill.id}
              className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 font-mono"
            >
              {skill.name}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-400">
              +{skills.length - 4}
            </span>
          )}
        </div>
      )}

      {/*  Footer: date + actions  */}
      <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
        <span className="flex items-center gap-1 text-xs text-neutral-400">
          <Clock className="w-3 h-3 shrink-0" />
          {formatRelative(createdAt)}
        </span>

        <div className="flex items-center gap-2">
          {actions ?? (
            // Default action when no slot provided: just "Ver oferta"
            <Link
              href={ROUTES.publicJob(id)}
              className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
            >
              Ver oferta →
            </Link>
          )}
        </div>
      </div>

    </div>
  )
}
