'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import {
  registerCandidateStep1Schema,
  registerCandidateStep2Schema,
  type RegisterCandidateStep1Values,
  type RegisterCandidateStep2Values,
} from '../schemas/auth.schemas'
import { useRegisterCandidate } from '../hooks/useAuth'
import { extractApiError } from '@/lib/utils/format'
import { ROUTES } from '@/config/routes'

//  Step indicator 

interface StepIndicatorProps {
  current: 1 | 2
}

function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: current === 1 ? '50%' : '100%' }}
        />
      </div>
      {/* Step labels */}
      <div className="flex justify-between">
        {(['Tu cuenta', 'Tu nombre'] as const).map((label, i) => {
          const step = (i + 1) as 1 | 2
          const isActive = step === current
          const isDone   = step < current
          return (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className={[
                  'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                  isDone   ? 'bg-brand-500 text-white' : '',
                  isActive ? 'bg-brand-500 text-white' : '',
                  !isDone && !isActive ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400' : '',
                ].join(' ')}
              >
                {isDone ? '✓' : step}
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive || isDone
                    ? 'text-neutral-700 dark:text-neutral-300'
                    : 'text-neutral-400 dark:text-neutral-600'
                }`}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

//  Step 1 

interface Step1Props {
  onNext: (data: RegisterCandidateStep1Values) => void
}

function Step1({ onNext }: Step1Props) {
  const [showPassword, setShowPassword]        = useState(false)
  const [showConfirmPassword, setShowConfirm]  = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCandidateStep1Values>({
    resolver: zodResolver(registerCandidateStep1Schema),
  })

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-5">

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          {...register('email')}
          className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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
            {...register('password')}
            className="w-full h-10 px-3 pr-10 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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
            {...register('confirmPassword')}
            className="w-full h-10 px-3 pr-10 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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

      <button
        type="submit"
        className="w-full h-10 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
      >
        Continuar
      </button>

    </form>
  )
}

//  Step 2 

interface Step2Props {
  onSubmit:  (data: RegisterCandidateStep2Values) => void
  onBack:    () => void
  isPending: boolean
  apiError:  string | null
}

function Step2({ onSubmit, onBack, isPending, apiError }: Step2Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCandidateStep2Values>({
    resolver: zodResolver(registerCandidateStep2Schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

      {apiError && (
        <div className="px-4 py-3 rounded-lg bg-danger-50 dark:bg-red-900/20 border border-danger-200 dark:border-red-800 text-sm text-danger-600 dark:text-red-400">
          {apiError}
        </div>
      )}

      {/* First name */}
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Nombre
        </label>
        <input
          id="firstName"
          type="text"
          autoComplete="given-name"
          placeholder="Tu nombre"
          autoFocus
          disabled={isPending}
          {...register('firstName')}
          className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50"
        />
        {errors.firstName && (
          <p className="mt-1.5 text-xs text-danger-500">{errors.firstName.message}</p>
        )}
      </div>

      {/* Last name */}
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Apellido
        </label>
        <input
          id="lastName"
          type="text"
          autoComplete="family-name"
          placeholder="Tu apellido"
          disabled={isPending}
          {...register('lastName')}
          className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50"
        />
        {errors.lastName && (
          <p className="mt-1.5 text-xs text-danger-500">{errors.lastName.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isPending}
          className="h-10 px-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="flex-1 h-10 rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isPending ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </div>

    </form>
  )
}

//  Main component 

export function RegisterCandidateForm() {
  const [step, setStep]                 = useState<1 | 2>(1)
  const [step1Data, setStep1Data]       = useState<RegisterCandidateStep1Values | null>(null)
  const [apiError, setApiError]         = useState<string | null>(null)

  const { mutate: register, isPending } = useRegisterCandidate()

  function handleStep1Next(data: RegisterCandidateStep1Values) {
    setStep1Data(data)
    setStep(2)
  }

  function handleStep2Submit(data: RegisterCandidateStep2Values) {
    if (!step1Data) return
    setApiError(null)

    register(
      {
        email:     step1Data.email,
        password:  step1Data.password,
        firstName: data.firstName,
        lastName:  data.lastName,
      },
      {
        onError: (err) => {
          setApiError(extractApiError(err))
          // If it's an email conflict, go back to step 1
          setStep(1)
        },
      },
    )
  }

  const titles = {
    1: { heading: 'Crear tu cuenta',    sub: 'Empezá tu carrera con TrayectorIA' },
    2: { heading: '¿Cómo te llamás?',   sub: 'Solo un paso más y listo'          },
  }

  return (
    <div className="w-full max-w-[480px]">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-card">

        <StepIndicator current={step} />

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
            {titles[step].heading}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {titles[step].sub}
          </p>
        </div>

        {step === 1 && (
          <Step1 onNext={handleStep1Next} />
        )}

        {step === 2 && (
          <Step2
            onSubmit={handleStep2Submit}
            onBack={() => { setStep(1); setApiError(null) }}
            isPending={isPending}
            apiError={apiError}
          />
        )}

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
