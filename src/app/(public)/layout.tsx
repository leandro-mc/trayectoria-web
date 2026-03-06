'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, LayoutDashboard } from 'lucide-react'
import { ThemeToggle } from '@/components/shared/layout/ThemeToggle'
import { useAuthStore } from '@/stores/auth.store'
import { ROUTES } from '@/config/routes'
import { cn } from '@/lib/utils/cn'

interface PublicLayoutProps {
  children: ReactNode
}

// Auth pages (login/register) use a centered card layout.
// The jobs page uses a full-width layout.
const AUTH_PATHS = ['/login', '/register']

export default function PublicLayout({ children }: PublicLayoutProps) {
  const pathname   = usePathname()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const role            = useAuthStore((s) => s.user?.role)
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p))

  const dashboardHref =
  role === 'COMPANY' ? ROUTES.companyDashboard : ROUTES.dashboard

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">

      {/*  Navbar  */}
      <header className="sticky top-0 z-20 h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">

        {/* Logo */}
        <Link href={ROUTES.publicJobs} className="flex items-center gap-2.5 group">
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-opacity group-hover:opacity-80"
            style={{ background: 'linear-gradient(135deg, #A855F7, #6366F1)' }}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
          <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
            TrayectorIA
          </span>
        </Link>

        {/* Center nav — only on jobs page */}
        {!isAuthPage && (
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href={ROUTES.publicJobs}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                pathname === ROUTES.publicJobs
                  ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100',
              )}
            >
              Ofertas
            </Link>
          </nav>
        )}

        {/* Right: theme + auth actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />

          {!isAuthPage && (
            <>
            {isAuthenticated ? (
                // Authenticated — show go to dashboard button
                <Link
                  href={dashboardHref}
                  className="inline-flex items-center gap-1.5 sm:gap-2 h-8 sm:h-9 px-3 sm:px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-medium transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Mi panel
                </Link>
              ) : (
                // Not authenticated — show login + register
                <>
                  <Link
                    href={ROUTES.login}
                    className="inline-flex h-8 sm:h-9 px-2.5 sm:px-4 items-center rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm font-medium transition-colors"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href={ROUTES.register}
                    className="inline-flex h-8 sm:h-9 px-2.5 sm:px-4 items-center rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-medium transition-colors"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </header>

      {/*  Content  */}
      <main className={cn('flex-1', isAuthPage && 'flex items-center justify-center px-4 py-12')}>
        {children}
      </main>

      {/*  Footer  */}
      <footer className="py-4 text-center border-t border-neutral-200 dark:border-neutral-800">
        <p className="text-xs text-neutral-400 dark:text-neutral-600">
          © {new Date().getFullYear()} TrayectorIA. Todos los derechos reservados.
        </p>
      </footer>

    </div>
  )
}
