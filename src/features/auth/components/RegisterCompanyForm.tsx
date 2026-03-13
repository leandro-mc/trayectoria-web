'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Building2 } from 'lucide-react'
import Link from 'next/link'
import { registerCompanySchema, type RegisterCompanyFormValues } from '../schemas/auth.schemas'
import { useRegisterCompany } from '../hooks/useAuth'
import { extractApiError } from '@/lib/utils/format'
import { ROUTES } from '@/config/routes'

export function RegisterCompanyForm() {
  const [showPassword, setShowPassword]       = useState(false)
  const [showConfirmPassword, setShowConfirm] = useState(false)
  const [apiError, setApiError]               = useState<string | null>(null)

  const { mutate: registerCompany, isPending } = useRegisterCompany()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCompanyFormValues>({
    resolver: zodResolver(registerCompanySchema),
  })

  function onSubmit(data: RegisterCompanyFormValues) {
    setApiError(null)
    registerCompany(
      {
        email:       data.email,
        password:    data.password,
        companyName: data.companyName,
      },
      {
        onError: (err) => setApiError(extractApiError(err)),
      },
    )
  }

  return (
    <div className="w-full max-w-[480px]">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-card">

        {/* Header */}
        <div className="mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-brand-500" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
            Registrá tu empresa
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Publicá ofertas y encontrá el talento que necesitás
          </p>
        </div>

        {/* API error */}
        {apiError && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-danger-50 dark:bg-red-900/20 border border-danger-200 dark:border-red-800 text-sm text-danger-600 dark:text-red-400">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

          {/* Company name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Nombre de la empresa
            </label>
            <input
              id="companyName"
              type="text"
              autoComplete="organization"
              placeholder="Ej: TechCorp S.A."
              disabled={isPending}
              {...register('companyName')}
              className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50"
            />
            {errors.companyName && (
              <p className="mt-1.5 text-xs text-danger-500">{errors.companyName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Email corporativo
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="contacto@empresa.com"
              disabled={isPending}
              {...register('email')}
              className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50"
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-danger-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                disabled={isPending}
                {...register('password')}
                className="w-full h-10 px-3 pr-10 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-danger-500">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Repetí tu contraseña"
                disabled={isPending}
                {...register('confirmPassword')}
                className="w-full h-10 px-3 pr-10 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                aria-label={showConfirmPassword ? 'Ocultar' : 'Mostrar'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs text-danger-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-10 rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? 'Creando cuenta...' : 'Crear cuenta de empresa'}
          </button>

        </form>

        {/* Register type switcher */}
        <div className="mt-5 pt-5 border-t border-neutral-100 dark:border-neutral-800">
          <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center">
            ¿Buscás trabajo?{' '}
            <Link
              href={ROUTES.registerCandidate}
              className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
            >
              Registrate como candidato
            </Link>
          </p>
        </div>

      </div>

      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
        ¿Ya tenés cuenta?{' '}
        <Link
          href={ROUTES.login}
          className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
        >
          Iniciá sesión
        </Link>
      </p>
    </div>
  )
}
