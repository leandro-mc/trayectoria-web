'use client'

import Link from 'next/link'
import {
  LayoutDashboard,
  User,
  Search,
  Briefcase,
  Bookmark,
  Sparkles,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { useUIStore } from '@/stores/ui.store'
import { useAuthStore } from '@/stores/auth.store'
import { useLogout } from '@/features/auth/hooks/useAuth'
import { SidebarLink } from './SidebarLink'
import { ThemeToggle } from './ThemeToggle'
import { getInitials } from '@/lib/utils/format'
import { ROUTES } from '@/config/routes'
import { cn } from '@/lib/utils/cn'

//  Nav items 

const NAV_ITEMS = [
  { href: ROUTES.dashboard,   icon: LayoutDashboard, label: 'Dashboard'           },
  { href: ROUTES.profile,     icon: User,            label: 'Mi Perfil'           },
  { href: ROUTES.jobs,        icon: Search,          label: 'Buscar empleos'      },
  { href: ROUTES.applications,icon: Briefcase,       label: 'Mis Postulaciones'   },
  { href: ROUTES.saved,       icon: Bookmark,        label: 'Guardadas'           },
  { href: ROUTES.curricula,   icon: Sparkles,        label: 'Mis Currículums', matchPrefix: true },
  { href: ROUTES.interviews,  icon: MessageSquare,   label: 'Entrevistas IA',  matchPrefix: true },
] as const

//  Component 

export function CandidateSidebar() {
  const collapsed      = useUIStore((s) => s.sidebarCollapsed)
  const toggleSidebar  = useUIStore((s) => s.toggleSidebar)
  const user           = useAuthStore((s) => s.user)
  const logout         = useLogout()

  const displayName = user?.email.split('@')[0] ?? 'Usuario'
  const initials    = getInitials(displayName)

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col h-screen sticky top-0 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-300 shrink-0',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {/*  Logo  */}
      <div className={cn(
        'h-16 flex items-center border-b border-neutral-200 dark:border-neutral-800 shrink-0',
        collapsed ? 'justify-center px-2' : 'px-4 gap-2.5',
      )}>
        <Link href={ROUTES.dashboard} className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-opacity group-hover:opacity-80"
            style={{ background: 'linear-gradient(135deg, #A855F7, #6366F1)' }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight truncate">
              TrayectorIA
            </span>
          )}
        </Link>
      </div>

      {/*  Nav  */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {NAV_ITEMS.map(({ href, icon, label, ...rest }) => (
          <SidebarLink
            key={href}
            href={href}
            icon={icon}
            label={label}
            collapsed={collapsed}
            {...rest}
          />
        ))}

        {/* Settings — at bottom of nav */}
        <div className="pt-2 mt-2 border-t border-neutral-100 dark:border-neutral-800">
          <SidebarLink
            href={ROUTES.settings}
            icon={Settings}
            label="Configuración"
            collapsed={collapsed}
          />
        </div>
      </nav>

      {/*  User + actions  */}
      <div className={cn(
        'border-t border-neutral-200 dark:border-neutral-800 p-3 space-y-2 shrink-0',
      )}>
        {/* Theme + collapse toggle */}
        <div className={cn(
          'flex items-center',
          collapsed ? 'flex-col gap-2' : 'justify-between',
        )}>
          <ThemeToggle />
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            {collapsed
              ? <ChevronRight className="w-4 h-4" />
              : <ChevronLeft  className="w-4 h-4" />
            }
          </button>
        </div>

        {/* User row */}
        <div className={cn(
          'flex items-center gap-2.5',
          collapsed && 'justify-center',
        )}>
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-xs font-bold text-brand-600 dark:text-brand-400 shrink-0">
            {initials}
          </div>

          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-danger-500 dark:hover:text-danger-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
