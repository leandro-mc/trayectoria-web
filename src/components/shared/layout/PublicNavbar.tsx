'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, LayoutDashboard } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { useAuthStore } from '@/stores/auth.store'
import { ROUTES } from '@/config/routes'

interface PublicNavbarProps {
  hideAuthButtons?: boolean
}

export function PublicNavbar({ hideAuthButtons = false }: PublicNavbarProps) {
  const pathname        = usePathname()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const role            = useAuthStore((s) => s.user?.role)

  const active          = hideAuthButtons ?? pathname
  const dashboardHref   = role === 'COMPANY' ? ROUTES.companyDashboard : ROUTES.dashboard

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm shrink-0">

      {/* Logo */}
      <Link href={ROUTES.publicJobs} className="flex items-center gap-2.5 group">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity group-hover:opacity-80"
          style={{ background: 'linear-gradient(135deg, #A855F7, #6366F1)' }}
        >
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="text-base font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
          TrayectorIA
        </span>
      </Link>

      {/* Center nav */}
      {pathname === ROUTES.publicJobs && (
        <nav className="hidden md:flex items-center gap-1">          
          <span className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400">
            Ofertas
          </span>
        </nav>
      )}

      {/* Right side */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {isAuthenticated ? (
          <Link
            href={dashboardHref}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Mi panel
          </Link>
        ) : (
          <>
            <Link
              href={ROUTES.login}
              className="hidden sm:inline-flex h-9 px-4 items-center rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-medium transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href={ROUTES.register}
              className="inline-flex h-9 px-4 items-center rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
