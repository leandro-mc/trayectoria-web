'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save, Sparkles } from 'lucide-react'
import { jobOfferSchema, type JobOfferFormValues } from '../schemas/job-offer.schemas'
import { useCreateJobOffer, useUpdateJobOffer } from '@/features/jobs/hooks/useJobOffers'
import { SkillPicker } from '@/features/skills/components/SkillPicker'
import { useSkillsCatalog } from '@/features/skills/hooks/useSkillsCatalog'
import { extractApiError } from '@/lib/utils/format'
import { ROUTES } from '@/config/routes'
import type { JobOfferResponse } from '@/features/jobs/types/jobs.types'
import type { SkillResponse } from '@/types/api.types'

//  Reusable field wrapper 

function Field({
  label, hint, error, required, children,
}: {
  label:    string
  hint?:    string
  error?:   string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
        {label}
        {required && <span className="text-danger-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint  && !error && <p className="mt-1.5 text-xs text-neutral-400">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-danger-500">{error}</p>}
    </div>
  )
}

const inputClass    = 'w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50'
const textareaClass = 'w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50 resize-none'
const selectClass   = 'w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50'

//  Section wrapper 

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-card p-6 space-y-5">
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 pb-3 border-b border-neutral-100 dark:border-neutral-800">
        {title}
      </h3>
      {children}
    </div>
  )
}

//  Props 

interface JobOfferFormProps {
  // Undefined = create mode, defined = edit mode
  initial?: JobOfferResponse
}

//  Component 

export function JobOfferForm({ initial }: JobOfferFormProps) {
  const router  = useRouter()
  const isEdit  = !!initial

  const { mutate: create, isPending: creating, error: createError } = useCreateJobOffer()
  const { mutate: update, isPending: updating, error: updateError } = useUpdateJobOffer()
  const isPending = creating || updating
  const apiError  = createError ?? updateError

  // Needed to resolve skill objects from initial skillIds for the SkillPicker
  const { data: catalog = [] } = useSkillsCatalog()

  const {
    register, handleSubmit, watch, reset, setValue,
    formState: { errors },
  } = useForm<JobOfferFormValues>({
    resolver: zodResolver(jobOfferSchema),
    defaultValues: {
      title:                 '',
      description:           '',
      responsibilities:      '',
      requirements:          '',
      benefits:              '',
      workMode:              undefined,
      jobType:               undefined,
      location:              '',
      requiresInterview:     false,
      interviewInstructions: '',
      expiresAt:             '',
      skillIds:              [],
    },
  })

  // Populate form in edit mode
  useEffect(() => {
    if (initial) {
      reset({
        title:                 initial.title,
        description:           initial.description           ?? '',
        responsibilities:      initial.responsibilities      ?? '',
        requirements:          initial.requirements          ?? '',
        benefits:              initial.benefits              ?? '',
        workMode:              initial.workMode              ?? undefined,
        jobType:               initial.jobType               ?? undefined,
        location:              initial.location              ?? '',
        requiresInterview:     initial.requiresInterview,
        interviewInstructions: '',
        expiresAt:             initial.expiresAt
          ? initial.expiresAt.split('T')[0]   // ISO -> YYYY-MM-DD for date input
          : '',
        skillIds:              initial.skills.map((s) => s.id),
      })
    }
  }, [initial, reset])

  const skillIds        = watch('skillIds')
  const requiresInterview = watch('requiresInterview')

  // Resolve full SkillResponse objects from IDs for the SkillPicker
  const selectedSkills: SkillResponse[] = catalog.filter((s) => skillIds.includes(s.id))

  function handleAddSkill(skill: SkillResponse) {
    if (!skillIds.includes(skill.id)) {
      setValue('skillIds', [...skillIds, skill.id], { shouldDirty: true })
    }
  }

  function handleRemoveSkill(skillId: number) {
    setValue('skillIds', skillIds.filter((id) => id !== skillId), { shouldDirty: true })
  }

  function onSubmit(data: JobOfferFormValues) {
    const payload = {
      title:                 data.title,
      description:           data.description           || undefined,
      responsibilities:      data.responsibilities      || undefined,
      requirements:          data.requirements          || undefined,
      benefits:              data.benefits              || undefined,
      workMode:              data.workMode,
      jobType:               data.jobType,
      location:              data.location              || undefined,
      requiresInterview:     data.requiresInterview,
      interviewInstructions: data.interviewInstructions || undefined,
      expiresAt:             data.expiresAt
        ? new Date(data.expiresAt).toISOString()
        : undefined,
      skillIds: data.skillIds,
    }

    if (isEdit) {
      update(
        { id: initial.id, data: payload },
        { onSuccess: () => router.push(ROUTES.offers) },
      )
    } else {
      create(
        payload,
        { onSuccess: () => router.push(ROUTES.offers) },
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/*  API error  */}
      {apiError && (
        <div className="px-4 py-3 rounded-lg bg-danger-50 dark:bg-red-900/20 border border-danger-200 dark:border-red-800 text-sm text-danger-600 dark:text-red-400">
          {extractApiError(apiError)}
        </div>
      )}

      {/*  Basic info  */}
      <Section title="Información básica">
        <Field label="Título del puesto" required error={errors.title?.message}>
          <input
            {...register('title')}
            placeholder="Ej: Desarrollador Backend Senior"
            disabled={isPending}
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Modalidad" error={errors.workMode?.message}>
            <select {...register('workMode')} disabled={isPending} className={selectClass}>
              <option value="">Sin especificar</option>
              <option value="REMOTE">Remoto</option>
              <option value="HYBRID">Híbrido</option>
              <option value="ON_SITE">Presencial</option>
            </select>
          </Field>
          <Field label="Tipo de jornada" error={errors.jobType?.message}>
            <select {...register('jobType')} disabled={isPending} className={selectClass}>
              <option value="">Sin especificar</option>
              <option value="FULL_TIME">Tiempo completo</option>
              <option value="PART_TIME">Medio tiempo</option>
              <option value="INTERNSHIP">Pasantía</option>
            </select>
          </Field>
          <Field label="Ubicación" error={errors.location?.message}>
            <input
              {...register('location')}
              placeholder="San José, Costa Rica"
              disabled={isPending}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Fecha de cierre" hint="Dejar vacío si no tiene fecha límite">
          <input
            type="date"
            {...register('expiresAt')}
            disabled={isPending}
            className={inputClass}
          />
        </Field>
      </Section>

      {/*  Content sections  */}
      <Section title="Contenido de la oferta">
        <Field label="Descripción">
          <textarea
            {...register('description')}
            rows={4}
            placeholder="Descripción general del puesto y la empresa..."
            disabled={isPending}
            className={textareaClass}
          />
        </Field>
        <Field label="Responsabilidades">
          <textarea
            {...register('responsibilities')}
            rows={4}
            placeholder="¿Qué hará la persona en este rol? Podés usar viñetas (- item)"
            disabled={isPending}
            className={textareaClass}
          />
        </Field>
        <Field label="Requisitos">
          <textarea
            {...register('requirements')}
            rows={4}
            placeholder="Experiencia, tecnologías, educación requeridos..."
            disabled={isPending}
            className={textareaClass}
          />
        </Field>
        <Field label="Beneficios">
          <textarea
            {...register('benefits')}
            rows={3}
            placeholder="Salario, seguro, horario flexible, home office..."
            disabled={isPending}
            className={textareaClass}
          />
        </Field>
      </Section>

      {/*  Skills  */}
      <Section title="Skills requeridas">
        <SkillPicker
          selected={selectedSkills}
          onAdd={handleAddSkill}
          onRemove={handleRemoveSkill}
          disabled={isPending}
        />
      </Section>

      {/*  Interview  */}
      <Section title="Entrevista con IA">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('requiresInterview')}
            disabled={isPending}
            className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-brand-500 focus:ring-brand-500"
          />
          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Requerir entrevista simulada con IA
            </p>
            <p className="text-xs text-neutral-400 mt-0.5">
              Los candidatos deberán completar una entrevista antes de postularse
            </p>
          </div>
        </label>

        {requiresInterview && (
          <div className="mt-4 p-4 rounded-xl bg-ai-50 dark:bg-ai-900/10 border border-ai-200 dark:border-ai-800">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-ai-500" />
              <span className="text-xs font-semibold text-ai-600 dark:text-ai-400">
                Instrucciones para la IA
              </span>
            </div>
            <textarea
              {...register('interviewInstructions')}
              rows={3}
              placeholder="Indicaciones específicas para la entrevista: tono, áreas a evaluar, preguntas obligatorias..."
              disabled={isPending}
              className={textareaClass}
            />
          </div>
        )}
      </Section>

      {/*  Submit  */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => router.push(ROUTES.offers)}
          disabled={isPending}
          className="h-10 px-5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 transition-colors"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          <Save className="w-4 h-4" />
          {isPending
            ? (isEdit ? 'Guardando...' : 'Publicando...')
            : (isEdit ? 'Guardar cambios' : 'Publicar oferta')
          }
        </button>
      </div>

    </form>
  )
}
