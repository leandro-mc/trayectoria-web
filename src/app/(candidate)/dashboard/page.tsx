import type { Metadata } from 'next'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { Sparkles, Briefcase, Bookmark, MessageSquare } from 'lucide-react'

export const metadata: Metadata = { title: 'Dashboard' }

// Quick action card
function QuickAction({
  icon: Icon,
  title,
  description,
  gradient,
}: {
  icon:        React.ComponentType<{ className?: string }>
  title:       string
  description: string
  gradient?:   boolean
}) {
  return (
    <div className={[
      'rounded-xl p-5 border',
      gradient
        ? 'border-brand-200 dark:border-brand-800 bg-gradient-to-br from-brand-50 to-ai-50 dark:from-brand-900/20 dark:to-ai-900/20'
        : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-card',
    ].join(' ')}>
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
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Bienvenido a TrayectorIA"
      />

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <QuickAction
          icon={Sparkles}
          title="Generar CV con IA"
          description="Creá un currículum personalizado para cada oferta"
          gradient
        />
        <QuickAction
          icon={MessageSquare}
          title="Practicar entrevista"
          description="Simulá entrevistas laborales con IA"
          gradient
        />
        <QuickAction
          icon={Briefcase}
          title="Mis postulaciones"
          description="Seguí el estado de tus aplicaciones"
        />
        <QuickAction
          icon={Bookmark}
          title="Ofertas guardadas"
          description="Revisá las ofertas que bookmarkeaste"
        />
      </div>

      {/* Coming soon notice */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 text-center shadow-card">
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          El contenido completo del dashboard se construye en{' '}
          <span className="font-mono text-brand-600 dark:text-brand-400">feat/candidate</span>
        </p>
      </div>
    </div>
  )
}
