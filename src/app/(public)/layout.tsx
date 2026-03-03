// Shared layout for all public/auth pages (login, register).
// No sidebar — just a centered, full-height wrapper with brand background.

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

interface PublicLayoutProps {
  children: ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">

      {/*  Top nav  */}
      <header className="h-16 flex items-center px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <Link href="/" className="flex items-center gap-2.5 group">
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
      </header>

      {/*  Content  */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      {/*  Footer  */}
      <footer className="py-4 text-center">
        <p className="text-xs text-neutral-400 dark:text-neutral-600">
          © {new Date().getFullYear()} TrayectorIA. Todos los derechos reservados.
        </p>
      </footer>

    </div>
  )
}
