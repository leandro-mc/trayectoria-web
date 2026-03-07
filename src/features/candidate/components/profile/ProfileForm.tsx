'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save } from 'lucide-react'
import { useCandidateProfile, useUpdateCandidateProfile } from '../../hooks/useCandidate'
import { profileSchema, type ProfileFormValues } from '../../schemas/candidate.schemas'
import { extractApiError } from '@/lib/utils/format'

//  Reusable field wrapper 

function Field({
  label, error, children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-danger-500">{error}</p>}
    </div>
  )
}

const inputClass = 'w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50'
const textareaClass = 'w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50 resize-none'

//  Component 

export function ProfileForm() {
  const { data: profile, isLoading } = useCandidateProfile()
  const { mutate: update, isPending, error } = useUpdateCandidateProfile()

  const {
    register, handleSubmit, reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  })

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      reset({
        firstName:    profile.firstName    ?? '',
        lastName:     profile.lastName     ?? '',
        phone:        profile.phone        ?? '',
        location:     profile.location     ?? '',
        bio:          profile.bio          ?? '',
        linkedinUrl:  profile.linkedinUrl  ?? '',
        githubUrl:    profile.githubUrl    ?? '',
        portfolioUrl: profile.portfolioUrl ?? '',
        birthdate:    profile.birthdate    ?? '',
      })
    }
  }, [profile, reset])

  function onSubmit(data: ProfileFormValues) {
    update({
      firstName:    data.firstName    || null,
      lastName:     data.lastName     || null,
      phone:        data.phone        || null,
      location:     data.location     || null,
      bio:          data.bio          || null,
      linkedinUrl:  data.linkedinUrl  || null,
      githubUrl:    data.githubUrl    || null,
      portfolioUrl: data.portfolioUrl || null,
      birthdate:    data.birthdate    || null,
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        ))}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* API error */}
      {error && (
        <div className="px-4 py-3 rounded-lg bg-danger-50 dark:bg-red-900/20 border border-danger-200 dark:border-red-800 text-sm text-danger-600 dark:text-red-400">
          {extractApiError(error)}
        </div>
      )}

      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nombre" error={errors.firstName?.message}>
          <input {...register('firstName')} placeholder="Tu nombre" disabled={isPending} className={inputClass} />
        </Field>
        <Field label="Apellido" error={errors.lastName?.message}>
          <input {...register('lastName')} placeholder="Tu apellido" disabled={isPending} className={inputClass} />
        </Field>
      </div>

      {/* Phone + location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Teléfono" error={errors.phone?.message}>
          <input {...register('phone')} placeholder="+506 8888-8888" disabled={isPending} className={inputClass} />
        </Field>
        <Field label="Ubicación" error={errors.location?.message}>
          <input {...register('location')} placeholder="San José, Costa Rica" disabled={isPending} className={inputClass} />
        </Field>
      </div>

      {/* Birthdate */}
      <Field label="Fecha de nacimiento" error={errors.birthdate?.message}>
        <input type="date" {...register('birthdate')} disabled={isPending} className={inputClass} />
      </Field>

      {/* Bio */}
      <Field label="Biografía" error={errors.bio?.message}>
        <textarea
          {...register('bio')}
          rows={3}
          placeholder="Contá brevemente sobre vos, tu experiencia y objetivos profesionales..."
          disabled={isPending}
          className={textareaClass}
        />
      </Field>

      {/* Links */}
      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">Links</p>
        <div className="space-y-4">
          <Field label="LinkedIn" error={errors.linkedinUrl?.message}>
            <input {...register('linkedinUrl')} placeholder="https://linkedin.com/in/tu-perfil" disabled={isPending} className={inputClass} />
          </Field>
          <Field label="GitHub" error={errors.githubUrl?.message}>
            <input {...register('githubUrl')} placeholder="https://github.com/tu-usuario" disabled={isPending} className={inputClass} />
          </Field>
          <Field label="Portfolio" error={errors.portfolioUrl?.message}>
            <input {...register('portfolioUrl')} placeholder="https://tu-portfolio.com" disabled={isPending} className={inputClass} />
          </Field>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isPending || !isDirty}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          <Save className="w-4 h-4" />
          {isPending ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

    </form>
  )
}
