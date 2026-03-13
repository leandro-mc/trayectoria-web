'use client'

import Link from 'next/link'
import { ListChecks, Users, Clock, PlusCircle } from 'lucide-react'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { useCompanyStats } from '@/features/company/hooks/useCompany'
import { ROUTES } from '@/config/routes'

function MetricCard({
  icon: Icon,
  label,
  value,
  href,
  accent,
}: {
  icon:  React.ComponentType<{ className?: string }>
  label: string
  value:   number | undefined
  href?:   string
  accent?: 'brand' | 'warning' | 'success'
}) {
  const iconBg =
    accent === 'brand'   ? 'bg-brand-50 dark:bg-brand-900/30' :
    accent === 'warning' ? 'bg-warning-50 dark:bg-orange-900/20' :
    accent === 'success' ? 'bg-success-50 dark:bg-green-900/20' :
    'bg-neutral-100 dark:bg-neutral-800'

  const iconColor =
    accent === 'brand'   ? 'text-brand-500' :
    accent === 'warning' ? 'text-warning-500' :
    accent === 'success' ? 'text-success-600' :
    'text-neutral-500 dark:text-neutral-400'

  const card = (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
          {label}
        </p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>

      {value === undefined ? (
        // Skeleton while loading
        <div className="h-8 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
      ) : (
        <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
          {value.toLocaleString()}
        </p>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{card}</Link>
  }
  return card
}

//  Page 

export default function CompanyDashboardPage() {
  const { data: stats } = useCompanyStats()

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Resumen de tu actividad"
        actions={
          <Link
            href={ROUTES.newOffer}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Nueva oferta
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          icon={ListChecks}
          label="Ofertas activas"
          value={stats?.activeOffers}
          href={ROUTES.offers}
          accent="success"
        />
        <MetricCard
          icon={Users}
          label="Total postulaciones"
          value={stats?.totalApplications}
          href={ROUTES.offers}
          accent="brand"
        />
        <MetricCard
          icon={Clock}
          label="Sin revisar"
          value={stats?.pendingApplications}
          href={ROUTES.offers}
          accent="warning"
        />
      </div>
    </div>
  )
}
