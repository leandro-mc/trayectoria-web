'use client'

import Link from 'next/link'
import { Sparkles, Briefcase, Bookmark, MessageSquare } from 'lucide-react'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { ROUTES } from '@/config/routes'

// Quick action card
function QuickAction({
  icon: Icon,
  title,
  description,
  href,
  gradient,
}: {
  icon:        React.ComponentType<{ className?: string }>
  title:       string
  description: string
  href:       string
  gradient?:   boolean
}) {
  return (
    <Link
      href={href}
      className={[
        'rounded-xl p-5 border transition-shadow hover:shadow-card-hover',
        gradient
          ? 'border-brand-200 dark:border-brand-800 bg-gradient-to-br from-brand-50 to-ai-50 dark:from-brand-900/20 dark:to-ai-900/20'
          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-card',
      ].join(' ')}
    >
      <div className={[
        'w-9 h-9 rounded-lg flex items-center justify-center mb-3',
        gradient
          ? 'bg-gradient-to-r from-ai-500 to-brand-500'
          : 'bg-neutral-100 dark:bg-neutral-800',
      ].join(' ')}>
        <Icon className={['w-5 h-5', gradient ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'].join(' ')} />
      </div>
      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">{title}</p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">{description}</p>
    </Link>
  )
}

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Bienvenido a TrayectorIA"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickAction
          icon={Sparkles}
          title="Generar CV con IA"
          description="Creá un currículum personalizado para cada oferta"
          href={ROUTES.curricula}
          gradient
        />
        <QuickAction
          icon={MessageSquare}
          title="Practicar entrevista"
          description="Simulá entrevistas laborales con IA"
          href={ROUTES.interviews}
          gradient
        />
        <QuickAction
          icon={Briefcase}
          title="Mis postulaciones"
          description="Seguí el estado de tus aplicaciones"
          href={ROUTES.applications}
        />
        <QuickAction
          icon={Bookmark}
          title="Ofertas guardadas"
          description="Revisá las ofertas que bookmarkeaste"
          href={ROUTES.saved}
        />
      </div>
    </div>
  )
}

