// Modal wrapper around CurriculumDisplay — used by the /ai/curricula history page.

'use client'

import { X, Sparkles } from 'lucide-react'
import { CurriculumDisplay } from './CurriculumDisplay'
import { formatDate } from '@/lib/utils/date'
import type { GeneratedCurriculumResponse } from '../types/curricula.types'

interface CurriculumViewerProps {
  curriculum: GeneratedCurriculumResponse
  onClose:    () => void
}

export function CurriculumViewer({ curriculum, onClose }: CurriculumViewerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 w-full sm:max-w-2xl max-h-[92dvh] sm:max-h-[85dvh] bg-white dark:bg-neutral-900 sm:rounded-2xl shadow-modal flex flex-col rounded-t-2xl">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
                style={{ background: 'linear-gradient(135deg,#A855F7,#6366F1)' }}
              >
                <Sparkles className="w-3 h-3" />
                Generado con IA
              </span>
            </div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              {curriculum.jobOfferTitle ?? 'Currículum'}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Generado el {formatDate(curriculum.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
          <CurriculumDisplay content={curriculum.content} />
        </div>
      </div>
    </div>
  )
}
