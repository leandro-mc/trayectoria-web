// Right panel — shows candidate info from the application response +
// the attached curriculum content if curriculumId is present.

'use client'

import { Mail, Sparkles } from 'lucide-react'
import { useCurriculum } from '@/features/ai/curricula/hooks/useCurricula'
import { CurriculumDisplay } from '@/features/ai/curricula/components/CurriculumDisplay'
import { formatDate } from '@/lib/utils/date'
import { cn } from '@/lib/utils/cn'
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
} from '@/config/constants'
import type { JobApplicationResponse } from '../types/applications.types'

//  Curriculum section 

function AttachedCurriculum({ id }: { id: number }) {
  const { data: cv, isLoading } = useCurriculum(id)

  if (isLoading) {
    return (
      <div className="space-y-2 animate-pulse px-1">
        {[88, 72, 91, 65].map((w, i) => (
          <div
            key={i}
            className="h-3 rounded-lg bg-neutral-200 dark:bg-neutral-800"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    )
  }

  if (!cv) {
    return (
      <p className="text-xs text-neutral-400 italic">
        No se pudo cargar el currículum.
      </p>
    )
  }

  return <CurriculumDisplay content={cv.content} compact />
}

//  Section wrapper 

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon:     React.ComponentType<{ className?: string }>
  title:    string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-neutral-400" />
        <h3 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
          {title}
        </h3>
      </div>
      {children}
    </div>
  )
}

//  Main panel 

interface CandidateProfilePanelProps {
  application: JobApplicationResponse
}

export function CandidateProfilePanel({ application }: CandidateProfilePanelProps) {
  const {
    candidateFirstName: firstName,
    candidateLastName:  lastName,
    candidateEmail:     email,
    candidateId,
    curriculumId,
    status,
    appliedAt,
  } = application

  const fullName = [firstName, lastName].filter(Boolean).join(' ') ||
    email ||
    `Candidato #${candidateId}`

  const initials = (firstName?.[0] ?? email?.[0] ?? '?').toUpperCase()

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900">

      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-base font-bold text-brand-600 dark:text-brand-400 shrink-0">
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 truncate">
              {fullName}
            </h2>
            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1 text-xs text-brand-500 hover:text-brand-600 mt-0.5"
              >
                <Mail className="w-3 h-3" />
                {email}
              </a>
            )}
          </div>
        </div>

        {/* Application meta */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className={cn(
            'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
            APPLICATION_STATUS_COLORS[status],
          )}>
            {APPLICATION_STATUS_LABELS[status]}
          </span>
          <span className="text-xs text-neutral-400">
            Postulado {formatDate(appliedAt)}
          </span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-6">

        {/* Curriculum attached */}
        {curriculumId !== null && curriculumId !== undefined ? (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg,#A855F7,#6366F1)' }}
              >
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <h3 className="text-xs font-bold text-ai-600 dark:text-ai-400 uppercase tracking-wide">
                Currículum personalizado adjunto
              </h3>
            </div>
            <div className="pl-1">
              <AttachedCurriculum id={curriculumId} />
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
            <p className="text-xs text-neutral-400">
              El candidato no adjuntó un currículum personalizado.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
