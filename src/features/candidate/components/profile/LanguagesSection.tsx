'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Loader2, Languages } from 'lucide-react'
import { useLanguages, useAddLanguage, useDeleteLanguage } from '../../hooks/useCandidate'
import { languageSchema, type LanguageFormValues } from '../../schemas/candidate.schemas'
import { LANGUAGE_LEVELS } from '@/config/constants'

const inputClass = 'w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50'
const selectClass = 'w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50'

export function LanguagesSection() {
  const { data: languages = [], isLoading } = useLanguages()
  const { mutate: addLang,    isPending: adding   } = useAddLanguage()
  const { mutate: deleteLang, isPending: deleting } = useDeleteLanguage()
  const [showForm, setShowForm] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LanguageFormValues>({
    resolver: zodResolver(languageSchema),
    defaultValues: { language: '', level: '' },
  })

  function onSubmit(data: LanguageFormValues) {
    addLang(
      { language: data.language, level: data.level || undefined },
      {
        onSuccess: () => {
          reset()
          setShowForm(false)
        },
      },
    )
  }

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-card">
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Idiomas</h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Agregar
          </button>
        )}
      </div>

      <div className="p-6 space-y-4">
        {/* Add form */}
        {showForm && (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <div className="flex-1">
              <input
                {...register('language')}
                placeholder="Ej: Inglés, Portugués"
                disabled={adding}
                className={inputClass}
              />
              {errors.language && <p className="mt-1 text-xs text-danger-500">{errors.language.message}</p>}
            </div>
            <div className="w-full sm:w-40">
              <select {...register('level')} disabled={adding} className={selectClass}>
                <option value="">Nivel</option>
                {LANGUAGE_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setShowForm(false); reset() }}
                disabled={adding}
                className="h-10 px-4 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={adding}
                className="h-10 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-medium transition-colors flex items-center gap-2"
              >
                {adding && <Loader2 className="w-4 h-4 animate-spin" />}
                Agregar
              </button>
            </div>
          </form>
        )}

        {/* List */}
        {isLoading && (
          <div className="space-y-2 animate-pulse">
            {[1, 2].map((i) => <div key={i} className="h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800" />)}
          </div>
        )}

        {!isLoading && languages.length === 0 && !showForm && (
          <div className="flex flex-col items-center py-6 text-center">
            <Languages className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mb-2" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Aún no agregaste idiomas</p>
          </div>
        )}

        {languages.map((lang) => (
          <div
            key={lang.language}
            className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 group transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {lang.language}
              </span>
              {lang.level && (
                <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
                  {lang.level}
                </span>
              )}
            </div>
            <button
              onClick={() => deleteLang(lang.language)}
              disabled={deleting}
              className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-danger-50 dark:hover:bg-red-900/20 text-neutral-400 hover:text-danger-500 transition-all disabled:opacity-50"
              aria-label={`Eliminar ${lang.language}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
