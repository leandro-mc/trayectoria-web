'use client'

import { Sun, Moon, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUIStore } from '@/stores/ui.store'

type Theme = 'light' | 'dark' | 'system'

const THEME_OPTIONS: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
  { value: 'light',  label: 'Claro',   icon: Sun },
  { value: 'dark',   label: 'Oscuro',  icon: Moon },
  { value: 'system', label: 'Sistema', icon: Monitor },
]

export function ThemeToggle() {
  const theme    = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)

  const CurrentIcon =
    theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          aria-label="Cambiar tema"
        >
          <CurrentIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36 bg-white dark:bg-neutral-900">
        {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className={theme === value ? 'text-brand-600 dark:text-brand-400' : ''}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
