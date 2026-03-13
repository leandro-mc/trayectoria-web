'use client'

/** Generic card-shaped skeleton */
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-card animate-pulse">
      <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4 mb-3" />
      <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2 mb-4" />
      {Array.from({ length: lines - 2 }).map((_, i) => (
        <div key={i} className="h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded mb-2" style={{ width: `${90 - i * 10}%` }} />
      ))}
    </div>
  )
}

/** Full page loading skeleton with header + cards */
export function PageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-8">
        <div className="h-7 bg-neutral-200 dark:bg-neutral-800 rounded w-48 mb-2" />
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-72" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}