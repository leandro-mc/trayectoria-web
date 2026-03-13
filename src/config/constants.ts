import type { WorkMode, JobType, ApplicationStatus, LanguageLevel, SkillType, JobStatus, InterviewRecommendation  } from '@/types/global.types'

//  Work Mode 

export const WORK_MODE_LABELS: Record<WorkMode, string> = {
  REMOTE:  'Remoto',
  HYBRID:  'Híbrido',
  ON_SITE: 'Presencial',
}

export const WORK_MODE_BADGE_STYLES: Record<WorkMode, string> = {
  REMOTE:  'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400',
  HYBRID:  'bg-warning-50 text-warning-600 dark:bg-yellow-900/20 dark:text-yellow-400',
  ON_SITE: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
}

//  Job Type 

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME:  'Tiempo completo',
  PART_TIME:  'Medio tiempo',
  INTERNSHIP: 'Pasantía',
}

//  Job Status 

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  ACTIVE: 'Activa',
  CLOSED: 'Cerrada',
  DRAFT:  'Borrador',
}

export const JOB_STATUS_BADGE_STYLES: Record<JobStatus, string> = {
  ACTIVE: 'bg-success-50 text-success-600 dark:bg-green-900/20 dark:text-green-400',
  CLOSED: 'bg-danger-50 text-danger-600 dark:bg-red-900/20 dark:text-red-400',
  DRAFT:  'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
}

//  Application Status 

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDING:   'Pendiente',
  VIEWED:    'Visto',
  IN_REVIEW: 'En revisión',
  ACCEPTED:  'Aceptado',
  REJECTED:  'Rechazado',
}

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
  PENDING:   'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
  VIEWED:    'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400',
  IN_REVIEW: 'bg-warning-50 text-warning-600 dark:bg-yellow-900/20 dark:text-yellow-400',
  ACCEPTED:  'bg-success-50 text-success-600 dark:bg-green-900/20 dark:text-green-400',
  REJECTED:  'bg-danger-50 text-danger-600 dark:bg-red-900/20 dark:text-red-400',
}

//  Language Levels 

export const LANGUAGE_LEVELS: readonly LanguageLevel[] = [
  'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native',
]

export const LANGUAGE_LEVEL_LABELS: Record<LanguageLevel, string> = {
  A1:     'A1 — Principiante',
  A2:     'A2 — Elemental',
  B1:     'B1 — Intermedio',
  B2:     'B2 — Intermedio alto',
  C1:     'C1 — Avanzado',
  C2:     'C2 — Dominio',
  Native: 'Nativo',
}

//  Skill Types 

export const SKILL_TYPES: readonly SkillType[] = [
  'TECHNICAL', 'SOFT', 'TOOL', 'LANGUAGE',
]

export const SKILL_TYPE_LABELS: Record<SkillType, string> = {
  TECHNICAL: 'Técnica',
  SOFT:      'Blanda',
  TOOL:      'Herramienta',
  LANGUAGE:  'Idioma',
}

//  Pagination 

export const DEFAULT_PAGE_SIZE = 10


//  Interview Recommendation 

export const INTERVIEW_RECOMMENDATION_LABELS: Record<InterviewRecommendation, string> = {
  STRONG_YES: 'Candidato destacado',
  YES:        'Recomendado',
  MAYBE:      'A considerar',
  NO:         'No recomendado',
}

export const INTERVIEW_RECOMMENDATION_COLORS: Record<InterviewRecommendation, string> = {
  STRONG_YES: 'bg-success-50 text-success-600 dark:bg-green-900/20 dark:text-green-400',
  YES:        'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400',
  MAYBE:      'bg-warning-50 text-warning-600 dark:bg-yellow-900/20 dark:text-yellow-400',
  NO:         'bg-danger-50 text-danger-600 dark:bg-red-900/20 dark:text-red-400',
}