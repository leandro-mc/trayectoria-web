'use client'

import { cn } from '@/lib/utils/cn'

interface SkeletonProps {
  className?: string
  style?:     React.CSSProperties  
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      style={style}
      className={cn(
        'animate-pulse rounded bg-neutral-200 dark:bg-neutral-800',
        className,
      )}
    />
  )
}

//  Card skeleton — for job offer cards 

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-card">
      <div className="flex items-start gap-4 mb-4">
        <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-5 w-3/4" />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  )
}

//  Profile skeleton 

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="space-y-3">
        {[100, 80, 90, 60].map((w, i) => (
          <Skeleton key={i} className="h-4" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  )
}

//  List skeleton — generic list of items 

interface ListSkeletonProps {
  rows?:      number
  className?: string
}

export function ListSkeleton({ rows = 4, className }: ListSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4" style={{ width: `${60 + (i % 3) * 10}%` }} />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

//  AI generation skeleton 

export function AIGenerationSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-ai-200 dark:border-ai-900 bg-gradient-to-br from-ai-50 to-brand-50 dark:from-ai-950/30 dark:to-brand-950/30 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-ai-500 to-brand-500 flex items-center justify-center animate-pulse">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L9.09 8.26L2 9.27L7 14.14L5.82 21.02L12 17.77L18.18 21.02L17 14.14L22 9.27L14.91 8.26L12 2Z" />
          </svg>
        </div>
        <span className="text-sm font-medium text-ai-600 dark:text-ai-400">
          La IA está trabajando...
        </span>
      </div>
      <div className="space-y-2">
        {[85, 75, 65, 55].map((w, i) => (
          <div
            key={i}
            className="h-3 rounded animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    </div>
  )
}
