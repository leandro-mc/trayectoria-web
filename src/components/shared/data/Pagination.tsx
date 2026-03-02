'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

interface PaginationProps {
  page:         number          // 0-based
  totalPages:   number
  totalElements: number
  onPageChange: (page: number) => void
  className?:   string
}

export function Pagination({
  page,
  totalPages,
  totalElements,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const isFirst = page === 0
  const isLast  = page === totalPages - 1

  // Generate visible page numbers with ellipsis logic
  function getPages(): Array<number | 'ellipsis'> {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i)
    }

    const pages: Array<number | 'ellipsis'> = [0]

    if (page > 2)             pages.push('ellipsis')
    if (page > 1)             pages.push(page - 1)
    if (page !== 0 && page !== totalPages - 1) pages.push(page)
    if (page < totalPages - 2) pages.push(page + 1)
    if (page < totalPages - 3) pages.push('ellipsis')

    pages.push(totalPages - 1)
    return pages
  }

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        {totalElements} resultado{totalElements !== 1 ? 's' : ''}
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page - 1)}
          disabled={isFirst}
          aria-label="Página anterior"
          className="h-8 w-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {getPages().map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-neutral-400 text-sm">…</span>
          ) : (
            <Button
              key={p}
              variant={p === page ? 'default' : 'outline'}
              size="icon"
              onClick={() => onPageChange(p as number)}
              className={cn(
                'h-8 w-8 text-sm',
                p === page && 'bg-brand-500 hover:bg-brand-600 text-white border-brand-500',
              )}
              aria-label={`Página ${(p as number) + 1}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {(p as number) + 1}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page + 1)}
          disabled={isLast}
          aria-label="Página siguiente"
          className="h-8 w-8"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
