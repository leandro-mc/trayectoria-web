'use client'

import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save, Camera } from 'lucide-react'
import { useCompanyProfile, useUpdateCompanyProfile, useUploadLogo } from '../hooks/useCompany'
import { companyProfileSchema, type CompanyProfileFormValues } from '../schemas/company.schemas'
import { extractApiError } from '@/lib/utils/format'
import { getInitials } from '@/lib/utils/format'

const inputClass    = 'w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50'
const textareaClass = 'w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50 resize-none'

function Field({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
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

export function CompanyProfileForm() {
  const { data: profile, isLoading }             = useCompanyProfile()
  const { mutate: update, isPending, error }      = useUpdateCompanyProfile()
  const { mutate: uploadLogo, isPending: uploading } = useUploadLogo()
  const logoInputRef = useRef<HTMLInputElement>(null)

  const {
    register, handleSubmit, reset,
    formState: { errors, isDirty },
  } = useForm<CompanyProfileFormValues>({
    resolver: zodResolver(companyProfileSchema),
  })

  useEffect(() => {
    if (profile) {
      reset({
        companyName: profile.companyName ?? '',
        industry:    profile.industry    ?? '',
        about:       profile.about       ?? '',
        website:     profile.website     ?? '',
        location:    profile.location    ?? '',
      })
    }
  }, [profile, reset])

  function onSubmit(data: CompanyProfileFormValues) {
    update({
      companyName: data.companyName || null,
      industry:    data.industry    || null,
      about:       data.about       || null,
      website:     data.website     || null,
      location:    data.location    || null,
    })
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadLogo(file)
    e.target.value = ''
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

  const displayName = profile?.companyName ?? profile?.email ?? ''

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/*  Logo + company name header  */}
      <div className="flex items-center gap-5 p-5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
        {/* Logo */}
        <div className="relative shrink-0">
          {profile?.logoUrl ? (
            <img
              src={profile.logoUrl}
              alt={displayName}
              className="w-20 h-20 rounded-xl object-cover border-2 border-neutral-200 dark:border-neutral-700"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-2xl font-bold text-brand-600 dark:text-brand-400 border-2 border-neutral-200 dark:border-neutral-700">
              {getInitials(displayName)}
            </div>
          )}
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white flex items-center justify-center shadow-md transition-colors"
            aria-label="Cambiar logo"
          >
            {uploading
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Camera className="w-3.5 h-3.5" />
            }
          </button>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoChange}
          />
        </div>

        <div>
          <p className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            {displayName || 'Tu empresa'}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{profile?.email}</p>
        </div>
      </div>

      {/*  API error  */}
      {error && (
        <div className="px-4 py-3 rounded-lg bg-danger-50 dark:bg-red-900/20 border border-danger-200 dark:border-red-800 text-sm text-danger-600 dark:text-red-400">
          {extractApiError(error)}
        </div>
      )}

      {/*  Fields  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Nombre de la empresa" error={errors.companyName?.message}>
          <input
            {...register('companyName')}
            placeholder="Nombre de tu empresa"
            disabled={isPending}
            className={inputClass}
          />
        </Field>
        <Field label="Industria" error={errors.industry?.message}>
          <input
            {...register('industry')}
            placeholder="Ej: Tecnología, Finanzas, Salud"
            disabled={isPending}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Sitio web" error={errors.website?.message}>
          <input
            {...register('website')}
            placeholder="https://tuempresa.com"
            disabled={isPending}
            className={inputClass}
          />
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

      <Field label="Sobre la empresa" error={errors.about?.message}>
        <textarea
          {...register('about')}
          rows={4}
          placeholder="Describí brevemente tu empresa, cultura, misión..."
          disabled={isPending}
          className={textareaClass}
        />
      </Field>

      <div className="flex justify-end">
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
