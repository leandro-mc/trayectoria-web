'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Pencil, Trash2, Loader2, Briefcase, X } from 'lucide-react'
import {
  useWorkExperience,
  useAddExperience,
  useUpdateExperience,
  useDeleteExperience,
} from '../../hooks/useCandidate'
import {
  workExperienceSchema,
  type WorkExperienceFormValues,
} from '../../schemas/candidate.schemas'
import { formatPeriod } from '@/lib/utils/date'
import type { WorkExperienceResponse } from '../../types/candidate.types'

//  Form Sheet 

interface ExperienceFormProps {
  initial?:  WorkExperienceResponse
  onClose:   () => void
}

const inputClass = 'w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50'
const textareaClass = 'w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50 resize-none'

function ExperienceForm({ initial, onClose }: ExperienceFormProps) {
  const { mutate: add,    isPending: adding   } = useAddExperience()
  const { mutate: update, isPending: updating } = useUpdateExperience()
  const isPending = adding || updating

  const { register, handleSubmit, watch, formState: { errors } } = useForm<WorkExperienceFormValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      company:     initial?.company     ?? '',
      position:    initial?.position    ?? '',
      description: initial?.description ?? '',
      startDate:   initial?.startDate   ?? '',
      endDate:     initial?.endDate     ?? '',
      isCurrent:   initial?.isCurrent   ?? false,
    },
  })

  const isCurrent = watch('isCurrent')

  function onSubmit(data: WorkExperienceFormValues) {
    const payload = {
      ...data,
      endDate: data.isCurrent ? undefined : (data.endDate || undefined),
      description: data.description || undefined,
      startDate: data.startDate || undefined,
    }

    if (initial) {
      update({ id: initial.id, data: payload }, { onSuccess: onClose })
    } else {
      add(payload, { onSuccess: onClose })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40 dark:bg-black/60" onClick={onClose} />

      {/* Sheet */}
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 h-full overflow-y-auto shadow-modal flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-neutral-200 dark:border-neutral-800">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            {initial ? 'Editar experiencia' : 'Agregar experiencia'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Empresa *</label>
            <input {...register('company')} placeholder="Nombre de la empresa" disabled={isPending} className={inputClass} />
            {errors.company && <p className="mt-1 text-xs text-danger-500">{errors.company.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Cargo *</label>
            <input {...register('position')} placeholder="Tu cargo o rol" disabled={isPending} className={inputClass} />
            {errors.position && <p className="mt-1 text-xs text-danger-500">{errors.position.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Descripción</label>
            <textarea {...register('description')} rows={3} placeholder="Describí tus responsabilidades y logros..." disabled={isPending} className={textareaClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Inicio</label>
              <input type="date" {...register('startDate')} disabled={isPending} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Fin</label>
              <input type="date" {...register('endDate')} disabled={isPending || isCurrent} className={inputClass} />
            </div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" {...register('isCurrent')} disabled={isPending} className="w-4 h-4 rounded border-neutral-300 text-brand-500 focus:ring-brand-500" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">Trabajo aquí actualmente</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isPending} className="flex-1 h-10 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 text-sm font-medium transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50">
              Cancelar
            </button>
            <button type="submit" disabled={isPending} className="flex-1 h-10 rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {initial ? 'Guardar cambios' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

//  Main section 

export function WorkExperienceSection() {
  const { data: experiences = [], isLoading } = useWorkExperience()
  const { mutate: deleteExp, isPending: deleting } = useDeleteExperience()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing]   = useState<WorkExperienceResponse | undefined>()

  function openAdd()                              { setEditing(undefined); setFormOpen(true) }
  function openEdit(exp: WorkExperienceResponse)  { setEditing(exp);       setFormOpen(true) }
  function closeForm()                            { setFormOpen(false);    setEditing(undefined) }

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-card">
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Experiencia laboral</h3>
        <button onClick={openAdd} className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors">
          <Plus className="w-4 h-4" /> Agregar
        </button>
      </div>

      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {isLoading && (
          <div className="p-6 space-y-3 animate-pulse">
            {[1, 2].map((i) => <div key={i} className="h-14 rounded-lg bg-neutral-100 dark:bg-neutral-800" />)}
          </div>
        )}

        {!isLoading && experiences.length === 0 && (
          <div className="flex flex-col items-center py-10 text-center px-6">
            <Briefcase className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mb-2" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Aún no agregaste experiencia laboral</p>
          </div>
        )}

        {experiences.map((exp) => (
          <div key={exp.id} className="flex items-start gap-4 px-6 py-4 group">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{exp.position}</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{exp.company}</p>
              <p className="text-xs text-neutral-400 mt-0.5">
                {formatPeriod(exp.startDate, exp.isCurrent ? null : exp.endDate, exp.isCurrent)}
              </p>
              {exp.description && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 line-clamp-2">{exp.description}</p>
              )}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button onClick={() => openEdit(exp)} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => deleteExp(exp.id)} disabled={deleting} className="p-1.5 rounded-lg hover:bg-danger-50 dark:hover:bg-red-900/20 text-neutral-400 hover:text-danger-500 transition-colors disabled:opacity-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {formOpen && <ExperienceForm initial={editing} onClose={closeForm} />}
    </div>
  )
}
