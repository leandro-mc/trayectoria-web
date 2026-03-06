import type { Metadata } from 'next'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { ListChecks, Users, PlusCircle, BarChart3 } from 'lucide-react'

export const metadata: Metadata = { title: 'Dashboard empresa' }

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon:  React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{label}</p>
        <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
          <Icon className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
        </div>
      </div>
      <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{value}</p>
    </div>
  )
}

export default function CompanyDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Resumen de tu actividad"
        actions={
          <a
            href="/company/offers/new"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Nueva oferta
          </a>
        }
      />

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard icon={ListChecks}  label="Ofertas activas"        value="—" />
        <MetricCard icon={Users}       label="Total postulaciones"     value="—" />
        <MetricCard icon={BarChart3}   label="Nuevas esta semana"      value="—" />
        <MetricCard icon={Users}       label="Sin revisar"             value="—" />
      </div>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 text-center shadow-card">
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          El contenido completo del dashboard se construye en{' '}
          <span className="font-mono text-brand-600 dark:text-brand-400">feat/company</span>
        </p>
      </div>
    </div>
  )
}
