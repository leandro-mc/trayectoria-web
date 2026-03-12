'use client'

import { useState } from 'react'
import { X, Sparkles, Loader2 } from 'lucide-react'
import { useGenerateCurriculum } from '../hooks/useCurricula'
import { useJobOffers } from '@/features/jobs/hooks/useJobOffers'
import { extractApiError } from '@/lib/utils/format'
import type { GeneratedCurriculumResponse } from '../types/curricula.types'

interface GenerateCurriculumModalProps {
  onClose:   () => void
  onSuccess: (curriculum: GeneratedCurriculumResponse) => void
}

export function GenerateCurriculumModal({ onClose, onSuccess }: GenerateCurriculumModalProps) {
  const [selectedJobId, setSelectedJobId] = useState<number | ''>('')

  // Usamos el listado de ofertas activas para el selector
  const { data: offersData, isLoading: loadingOffers } = useJobOffers({ page: 0 })
  const { mutate: generate, isPending, error } = useGenerateCurriculum()

  function handleGenerate() {
    if (!selectedJobId) return
    generate(
      { jobOfferId: Number(selectedJobId) },
      {
        onSuccess: (curriculum) => {
          onSuccess(curriculum)
          onClose()
        },
      },
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={() => !isPending && onClose()} />

      <div className="relative z-10 w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-modal">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #A855F7, #6366F1)' }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Generar currículum con IA
              </h2>
              <p className="text-xs text-neutral-400">
                La IA lo optimiza para la oferta elegida
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 disabled:opacity-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              ¿Para qué oferta?
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value ? Number(e.target.value) : '')}
              disabled={isPending || loadingOffers}
              className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
            >
              <option value="">Seleccioná una oferta...</option>
              {offersData?.content
                .filter((o) => o.status === 'ACTIVE')
                .map((offer) => (
                  <option key={offer.id} value={offer.id}>
                    {offer.title} — {offer.companyName ?? 'Empresa'}
                  </option>
                ))}
            </select>
          </div>

          {/* Info card */}
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              La IA analizará tu perfil completo y los requisitos de la oferta para generar un currículum personalizado que maximice tus chances.
            </p>
          </div>

          {error && (
            <p className="text-xs text-danger-500">{extractApiError(error)}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 pb-5">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 h-10 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleGenerate}
            disabled={isPending || !selectedJobId}
            className="flex-1 h-10 rounded-xl text-white text-sm font-semibold disabled:opacity-50 transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #A855F7, #6366F1)' }}
          >
            {isPending
              ? <><Loader2 className="w-4 h-4 animate-spin" />Generando...</>
              : <><Sparkles className="w-4 h-4" />Generar</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}
