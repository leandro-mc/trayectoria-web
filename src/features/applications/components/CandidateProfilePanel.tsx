// Right panel — shows candidate info from the application response +
// - curriculumId != null → show the personalized CV attached to the application
// - curriculumId == null → fetch base curriculum from candidate's profile data

'use client'

import { Mail, Sparkles, FileText } from 'lucide-react'
import { useCurriculum, useBaseCurriculum,} from '@/features/ai/curricula/hooks/useCurricula'
import { CurriculumDisplay } from '@/features/ai/curricula/components/CurriculumDisplay'
import { formatDate } from '@/lib/utils/date'
import { cn } from '@/lib/utils/cn'
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS,} from '@/config/constants'
import type { JobApplicationResponse } from '../types/applications.types'

//  Curriculum loaders 

function CurriculumSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {[88, 72, 91, 65, 80].map((w, i) => (
        <div
          key={i}
          className="h-3 rounded-lg bg-neutral-200 dark:bg-neutral-800"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  )
}

// Personalized CV — candidate explicitly attached this to the application
function AttachedCurriculum({ id }: { id: number }) {
  const { data: cv, isLoading } = useCurriculum(id)

  return (
    <>
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
      {isLoading
        ? <CurriculumSkeleton />
        : cv
          ? <CurriculumDisplay content={cv.content} compact />
          : <p className="text-xs text-neutral-400 italic">No se pudo cargar el currículum.</p>
      }
    </>
  )
}

// Base CV — built from candidate's profile, no AI, not stored in DB
function BaseCurriculum({ candidateId }: { candidateId: number }) {
  const { data: cv, isLoading } = useBaseCurriculum(candidateId)

  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center shrink-0">
          <FileText className="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
        </div>
        <h3 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
          Perfil del candidato
        </h3>
      </div>
      {isLoading
        ? <CurriculumSkeleton />
        : cv
          ? <CurriculumDisplay content={cv.content} compact />
          : <p className="text-xs text-neutral-400 italic">No hay información de perfil disponible.</p>
      }
    </>
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
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5">
        {curriculumId != null
          ? <AttachedCurriculum id={curriculumId} />
          : <BaseCurriculum candidateId={candidateId} />
        }
      </div>
    </div>
  )
}