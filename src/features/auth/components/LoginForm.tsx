'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { loginSchema, type LoginFormValues } from '../schemas/auth.schemas'
import { useLogin } from '../hooks/useAuth'
import { extractApiError } from '@/lib/utils/format'
import { ROUTES } from '@/config/routes'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError]         = useState<string | null>(null)

  const { mutate: login, isPending } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver:      zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  function onSubmit(data: LoginFormValues) {
    setApiError(null)
    login(data, {
      onError: (err) => setApiError(extractApiError(err)),
    })
  }

  return (
    <div className="w-full max-w-[480px]">

      {/*  Card  */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-card">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
            Bienvenido de vuelta
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Ingresá a tu cuenta para continuar
          </p>
        </div>

        {/* API error banner */}
        {apiError && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-danger-50 dark:bg-red-900/20 border border-danger-200 dark:border-red-800 text-sm text-danger-600 dark:text-red-400">
            {apiError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              disabled={isPending}
              {...register('email')}
              className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-danger-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Contraseña
              </label>
              {/* Phase 2: forgot password */}
              <span className="text-xs text-neutral-400 cursor-not-allowed" title="Próximamente">
                ¿Olvidaste tu contraseña?
              </span>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                disabled={isPending}
                {...register('password')}
                className="w-full h-10 px-3 pr-10 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword
                  ? <EyeOff className="w-4 h-4" />
                  : <Eye    className="w-4 h-4" />
                }
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-danger-500">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-10 rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? 'Ingresando...' : 'Iniciar sesión'}
          </button>

        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white dark:bg-neutral-900 px-3 text-xs text-neutral-400">
              o continuá con
            </span>
          </div>
        </div>

        {/* Google — Phase 2 */}
        <button
          type="button"
          disabled
          className="w-full h-10 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-400 text-sm font-medium flex items-center justify-center gap-2 cursor-not-allowed opacity-50"
          title="Próximamente"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuar con Google (próximamente)
        </button>

      </div>

      {/* Footer link */}
      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
        ¿No tenés cuenta?{' '}
        <Link
          href={ROUTES.register}
          className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
        >
          Registrate
        </Link>
      </p>

    </div>
  )
}
