'use client'

import { useState } from 'react'
import { Send, Loader2, CheckCircle2, X } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { useApply } from '@/features/applications/hooks/useApplications'
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
  const [showGate,  setShowGate]  = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [applied,   setApplied]   = useState(false)

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isCandidate     = useAuthStore((s) => s.user?.role === 'CANDIDATE')

  const { mutate: apply, isPending } = useApply()

  const isClosed = offerStatus === 'CLOSED'

  function handleClick() {
    if (!isAuthenticated || !isCandidate) { setShowGate(true); return }
    setShowModal(true)
  }

  function handleConfirm() {
    apply(
      { jobOfferId },
      {
        onSuccess: () => {
          setApplied(true)
          setTimeout(() => setShowModal(false), 1500)
        },
      },
    )
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isClosed}
        className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors"
      >
        <Send className="w-3.5 h-3.5" />
        {isClosed ? 'Cerrada' : 'Postularme'}
      </button>

      {/* Auth gate */}
      {showGate && (
        <AuthGateModal
          action="postularte a esta oferta"
          onClose={() => setShowGate(false)}
        />
      )}

      {/* Apply confirmation modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={() => !isPending && setShowModal(false)} />
          <div className="relative z-10 w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-modal p-6">

            <button
              onClick={() => setShowModal(false)}
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
                  La empresa recibirá tu perfil
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                  Confirmar postulación
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                  {jobTitle}
                  {companyName && (
                    <span className="block text-xs mt-0.5 text-neutral-400">{companyName}</span>
                  )}
                </p>

                {/* Curriculum note — will be enhanced in feat/ai */}
                <div className="mt-4 mb-5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Se enviará tu perfil completo. Podés generar un{' '}
                    <span className="text-ai-500 font-medium">CV personalizado ✨</span>{' '}
                    para esta oferta desde la sección de IA.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowModal(false)}
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
