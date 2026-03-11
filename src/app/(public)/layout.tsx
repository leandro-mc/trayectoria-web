'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { PublicNavbar } from '@/components/shared/layout/PublicNavbar'
import { cn } from '@/lib/utils/cn'

interface PublicLayoutProps {
  children: ReactNode
}

// Auth pages (login/register) use a centered card layout.
// The jobs page uses a full-width layout.
const AUTH_PATHS = ['/login', '/register']

export default function PublicLayout({ children }: PublicLayoutProps) {
  const pathname   = usePathname()
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p))

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
      <PublicNavbar hideAuthButtons={isAuthPage} />

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
