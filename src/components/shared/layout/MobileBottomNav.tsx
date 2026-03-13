'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Search, Briefcase, Sparkles, User,
  ListChecks, Building2, MoreHorizontal,
  Sun, Moon, Monitor, LogOut, X,
} from 'lucide-react'
import { ROUTES } from '@/config/routes'
import { useAuthStore } from '@/stores/auth.store'
import { useUIStore } from '@/stores/ui.store'
import type { Theme } from '@/stores/ui.store'
import { cn } from '@/lib/utils/cn'

//  Nav configs per role 

const CANDIDATE_NAV = [
  { href: ROUTES.dashboard,    icon: LayoutDashboard, label: 'Inicio'        },
  { href: ROUTES.jobs,         icon: Search,          label: 'Empleos'       },
  { href: ROUTES.applications, icon: Briefcase,       label: 'Postulaciones' },
  { href: ROUTES.curricula,    icon: Sparkles,        label: 'IA'            },
  { href: ROUTES.profile,      icon: User,            label: 'Perfil'        },
] as const

const COMPANY_NAV = [
  { href: ROUTES.companyDashboard, icon: LayoutDashboard, label: 'Inicio'   },
  { href: ROUTES.offers,           icon: ListChecks,      label: 'Ofertas'  },
  { href: ROUTES.jobs,             icon: Search,          label: 'Explorar' },
  { href: ROUTES.companyProfile,   icon: Building2,       label: 'Perfil'   },
] as const

//  Theme cycling 

const NEXT_THEME: Record<Theme, Theme> = {
  light:  'dark',
  dark:   'system',
  system: 'light',
}
const THEME_ICONS: Record<Theme, typeof Sun> = {
  light:  Sun,
  dark:   Moon,
  system: Monitor,
}
const THEME_LABELS: Record<Theme, string> = {
  light:  'Claro',
  dark:   'Oscuro',
  system: 'Sistema',
}

//  More sheet 

function MoreSheet({ onClose }: { onClose: () => void }) {
  const router   = useRouter()
  const user     = useAuthStore((s) => s.user)
  const logout   = useAuthStore((s) => s.logout)
  const theme    = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)

  const ThemeIcon = THEME_ICONS[theme]

  function cycleTheme() {
    setTheme(NEXT_THEME[theme])
  }

  function handleLogout() {
    logout()
    onClose()
    router.replace(ROUTES.login)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 rounded-t-2xl shadow-modal pb-safe">

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* User info */}
        <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <p className="text-xs text-neutral-400">
            {user?.role === 'CANDIDATE' ? 'Candidato' : 'Empresa'}
          </p>
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate mt-0.5">
            {user?.email}
          </p>
        </div>

        {/* Actions */}
        <div className="px-3 py-3 space-y-1">
          {/* Theme toggle */}
          <button
            onClick={cycleTheme}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
              <ThemeIcon className="w-4.5 h-4.5 text-neutral-600 dark:text-neutral-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Apariencia
              </p>
              <p className="text-xs text-neutral-400">
                {THEME_LABELS[theme]} — toca para cambiar
              </p>
            </div>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-danger-50 dark:hover:bg-red-900/20 transition-colors text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-danger-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
              <LogOut className="w-4.5 h-4.5 text-danger-500" />
            </div>
            <p className="text-sm font-medium text-danger-500">
              Cerrar sesión
            </p>
          </button>
        </div>

        {/* Bottom safe area spacer */}
        <div className="h-4" />
      </div>
    </>
  )
}

//  Nav item 

function NavItem({
  href, icon: Icon, label, isActive,
}: {
  href:     string
  icon:     React.ComponentType<{ className?: string }>
  label:    string
  isActive: boolean
}) {
  return (
    <Link
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
}

//  Component 

export function MobileBottomNav() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const pathname = usePathname()
  const role     = useAuthStore((s) => s.user?.role)

  const navItems = role === 'COMPANY' ? COMPANY_NAV : CANDIDATE_NAV

  return (
    <>
      <nav className="lg:hidden shrink-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
        {/* Fixed height bar */}
        <div className="flex items-center h-16">
          {/* Dynamic nav items */}
          {navItems.map(({ href, icon, label }) => {
            // /ai/* routes: active when on any AI page (curricula or interviews)
            const isAI     = href === ROUTES.curricula && pathname.startsWith('/ai')
            const isActive = isAI || pathname === href || (href !== '/jobs' && pathname.startsWith(href + '/'))
            return (
              <NavItem
                key={href}
                href={href}
                icon={icon}
                label={label}
                isActive={isActive}
              />
            )
          })}

          {/* More button — always last */}
          <button
            onClick={() => setSheetOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 h-full transition-colors text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-medium">Más</span>
          </button>
        </div>

        {/* iOS safe area fill */}
        <div className="h-safe-bottom bg-white dark:bg-neutral-900" />
      </nav>

      {sheetOpen && <MoreSheet onClose={() => setSheetOpen(false)} />}
    </>
  )
}
