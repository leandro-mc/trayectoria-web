'use client'

import { useState } from 'react'
import { Send, Loader2, CheckCircle2, X, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { useApply, useHasApplied } from '@/features/applications/hooks/useApplications'
import { useCurricula } from '@/features/ai/curricula/hooks/useCurricula'
import { AuthGateModal } from './AuthGateModal'

interface ApplyButtonProps {
  jobOfferId:  number
  jobTitle:    string
  companyName: string | null
  offerStatus: string
}

export function ApplyButton({
  jobOfferId,
  jobTitle,
  companyName,
  offerStatus,
}: ApplyButtonProps) {
  const [showGate,     setShowGate]     = useState(false)
  const [showModal,    setShowModal]    = useState(false)
  const [applied,      setApplied]      = useState(false)
  const [selectedCvId, setSelectedCvId] = useState<number | ''>('')

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isCandidate     = useAuthStore((s) => s.user?.role === 'CANDIDATE')

  // Only active for candidates — query is disabled for company/public
  const { hasApplied }         = useHasApplied(isCandidate ? jobOfferId : null)
  const { mutate: apply, isPending } = useApply()
  const { data: curricula = [] }     = useCurricula()

  const matchingCurricula = curricula.filter((cv) => cv.jobOfferId === jobOfferId)

  const isClosed = offerStatus === 'CLOSED'
  const isDisabled = isClosed || hasApplied

  function handleClick() {
    if (!isAuthenticated || !isCandidate) { setShowGate(true); return }
    if (isDisabled) return
    setSelectedCvId(matchingCurricula[0]?.id ?? '')
    setApplied(false)
    setShowModal(true)
  }

  function handleConfirm() {
    apply(
      {
        jobOfferId,
        data: selectedCvId ? { curriculumId: Number(selectedCvId) } : undefined,
      },
      {
        onSuccess: () => {
          setApplied(true)
          setTimeout(() => setShowModal(false), 1500)
        },
      },
    )
  }

  function handleClose() {
    if (isPending) return
    setShowModal(false)
  }

  // ── Button label ───────────────────────────────────────────────────────────
  const buttonLabel = isClosed
    ? 'Cerrada'
    : hasApplied
      ? '✓ Ya postulado'
      : 'Postularme'

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isDisabled}
        title={hasApplied ? 'Ya te postulaste a esta oferta' : undefined}
        className={[
          'inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-semibold transition-colors',
          isDisabled
            ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
            : 'bg-brand-500 hover:bg-brand-600 text-white',
        ].join(' ')}
      >
        {!isDisabled && <Send className="w-3.5 h-3.5" />}
        {buttonLabel}
      </button>

      {/* Auth gate */}
      {showGate && (
        <AuthGateModal
          action="postularte a esta oferta"
          onClose={() => setShowGate(false)}
        />
      )}

      {/* Confirm modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={handleClose} />
          <div className="relative z-10 w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-modal p-6">

            <button
              onClick={handleClose}
              disabled={isPending}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>

            {applied ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-success-500 mx-auto mb-3" />
                <p className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  ¡Postulación enviada!
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {selectedCvId
                    ? 'Se adjuntó tu currículum personalizado ✨'
                    : 'La empresa recibirá tu perfil completo'
                  }
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                  Confirmar postulación
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{jobTitle}</p>
                {companyName && (
                  <p className="text-xs text-neutral-400 mt-0.5 mb-4">{companyName}</p>
                )}

                {matchingCurricula.length > 0 ? (
                  <div className="mt-4 mb-5">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-ai-500" />
                      Adjuntar currículum con IA
                    </label>
                    <select
                      value={selectedCvId}
                      onChange={(e) => setSelectedCvId(e.target.value ? Number(e.target.value) : '')}
                      className="w-full h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="">Solo mi perfil (sin CV adjunto)</option>
                      {matchingCurricula.map((cv) => (
                        <option key={cv.id} value={cv.id}>
                          ✨ CV para esta oferta — {new Date(cv.createdAt).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="mt-4 mb-5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Se enviará tu perfil completo. Podés generar un{' '}
                      <span className="text-ai-500 font-medium">CV personalizado ✨</span>{' '}
                      para esta oferta desde el panel de la oferta.
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleClose}
                    disabled={isPending}
                    className="flex-1 h-10 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={isPending}
                    className="flex-1 h-10 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isPending ? 'Enviando...' : 'Confirmar'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
