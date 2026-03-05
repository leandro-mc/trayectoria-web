'use client'

import Link from 'next/link'
import { UserRound, Building2, ArrowRight } from 'lucide-react'
import { ROUTES } from '@/config/routes'

interface RoleCardProps {
  href:        string
  icon:        React.ReactNode
  title:       string
  description: string
  cta:         string
}

function RoleCard({ href, icon, title, description, cta }: RoleCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-card hover:shadow-card-hover hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-200"
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mb-4 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/50 transition-colors">
        {icon}
      </div>

      {/* Text */}
      <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5">
        {title}
      </h2>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 flex-1 mb-5">
        {description}
      </p>

      {/* CTA */}
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:gap-2.5 transition-all">
        {cta}
        <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  )
}

export function RegisterRoleSelector() {
  return (
    <div className="w-full max-w-lg">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          ¿Cómo querés usar TrayectorIA?
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Elegí el tipo de cuenta que mejor se adapta a vos
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <RoleCard
          href={ROUTES.registerCandidate}
          icon={<UserRound className="w-6 h-6 text-brand-500" />}
          title="Soy candidato"
          description="Buscás trabajo, querés mejorar tu CV con IA o practicar entrevistas."
          cta="Crear cuenta"
        />
        <RoleCard
          href={ROUTES.registerCompany}
          icon={<Building2 className="w-6 h-6 text-brand-500" />}
          title="Soy empresa"
          description="Publicás ofertas laborales y buscás talento para tu equipo."
          cta="Crear cuenta"
        />
      </div>

      {/* Login link */}
      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
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
