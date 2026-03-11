'use client'

import { X, Sparkles, LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'

interface AuthGateModalProps {
  action:  string   // e.g. "postularte" | "guardar esta oferta"
  onClose: () => void
}

export function AuthGateModal({ action, onClose }: AuthGateModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-modal p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'linear-gradient(135deg, #A855F7, #6366F1)' }}
        >
          <Sparkles className="w-6 h-6 text-white" />
        </div>

        <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Necesitás una cuenta
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
          Para {action} en TrayectorIA, creá tu cuenta gratis o iniciá sesión.
        </p>

        <div className="flex flex-col gap-2">
          <Link
            href={ROUTES.register}
            className="flex items-center justify-center gap-2 h-10 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors"
            onClick={onClose}
          >
            <UserPlus className="w-4 h-4" />
            Crear cuenta gratis
          </Link>
          <Link
            href={ROUTES.login}
            className="flex items-center justify-center gap-2 h-10 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-medium transition-colors"
            onClick={onClose}
          >
            <LogIn className="w-4 h-4" />
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
