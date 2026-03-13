'use client'

import NextLink from 'next/link'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface EmptyStateProps {
  icon:        LucideIcon
  title:       string
  description: string
  action?:     {
    label:   string
    href?:   string
    onClick?: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 text-center px-4',
        className,
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
      </div>

      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
        {title}
      </h3>

      <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-6">
        {description}
      </p>

      {action && (
        action.href
          ? (
            <NextLink 
              href={action.href}
              className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
            >
              {action.label}
            </NextLink>
          ) : (
            <button
              onClick={action.onClick}
              className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
            >
              {action.label}
            </button>
          )
      )}
    </div>
  )
}
