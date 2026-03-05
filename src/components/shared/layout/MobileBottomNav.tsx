'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Search,
  Briefcase,
  Sparkles,
  User,
} from 'lucide-react'
import { ROUTES } from '@/config/routes'
import { cn } from '@/lib/utils/cn'

// Max 5 items for mobile bottom nav
const MOBILE_NAV_ITEMS = [
  { href: ROUTES.dashboard,    icon: LayoutDashboard, label: 'Inicio'       },
  { href: ROUTES.jobs,         icon: Search,          label: 'Empleos'      },
  { href: ROUTES.applications, icon: Briefcase,       label: 'Postulaciones'},
  { href: ROUTES.curricula,    icon: Sparkles,        label: 'IA'           },
  { href: ROUTES.profile,      icon: User,            label: 'Perfil'       },
] as const

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center safe-area-inset-bottom">
      {MOBILE_NAV_ITEMS.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5 h-full transition-colors',
              isActive
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300',
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
