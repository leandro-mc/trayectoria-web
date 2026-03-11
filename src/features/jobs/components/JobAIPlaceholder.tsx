// Right panel for AI mode - placeholder until feat/ai is implemented.
// Shows a clear "coming soon" state that will be replaced with real functionality.

'use client'

import { Sparkles, MessageSquare, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useJobsParams, type JobsMode } from '../hooks/useJobsParams'
import { ROUTES } from '@/config/routes'

const AI_CONFIG: Record<JobsMode, {
  icon:        React.ComponentType<{ className?: string }>
  title:       string
  description: string
  cta:         string
  href:        string
}> = {
  cv: {
    icon:        Sparkles,
    title:       'CV personalizado con IA',
    description: 'La IA analizará esta oferta y tu perfil para generar un currículum optimizado que resalte tus habilidades más relevantes.',
    cta:         'Ir a Mis Currículums',
    href:        ROUTES.curricula,
  },
  interview: {
    icon:        MessageSquare,
    title:       'Entrevista simulada con IA',
    description: 'Practicá una entrevista real para este puesto. La IA te hará preguntas específicas basadas en la oferta y te dará feedback detallado.',
    cta:         'Ir a Entrevistas IA',
    href:        ROUTES.interviews,
  },
}

export function JobAIPlaceholder() {
  const { mode } = useJobsParams()

  if (mode !== 'cv' && mode !== 'interview') return null

  const config = AI_CONFIG[mode]
  const Icon   = config.icon

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-neutral-900 p-8">

      {/* AI badge */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: 'linear-gradient(135deg, #A855F7, #6366F1)' }}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>

      {/* Content */}
      <div className="max-w-sm text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ai-50 dark:bg-ai-900/20 border border-ai-200 dark:border-ai-800 text-ai-600 dark:text-ai-400 text-xs font-medium mb-4">
          <Sparkles className="w-3 h-3" />
          Powered by AI
        </div>

        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-3">
          {config.title}
        </h3>

        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6">
          {config.description}
        </p>

        <Link
          href={config.href}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #A855F7, #6366F1)' }}
        >
          {config.cta}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
