'use client'

import { Suspense } from 'react'
import { Search, Sparkles, Trash2, Loader2 } from 'lucide-react'
import { AILeftPanel, useAIParams } from '@/features/ai/components/AILeftPanel'
import { CurriculumDisplay } from '@/features/ai/curricula/components/CurriculumDisplay'
import { useCurriculum, useDeleteCurriculum } from '@/features/ai/curricula/hooks/useCurricula'
import { cn } from '@/lib/utils/cn'

//  Right panel — selected curriculum 

function CurriculumPanel({ id, onClear }: { id: number; onClear: () => void }) {
  const { data: cv, isLoading }            = useCurriculum(id)
  const { mutate: remove, isPending: deleting } = useDeleteCurriculum()

  if (isLoading || !cv) {
    return (
      <div className="p-6 space-y-3 animate-pulse">
        {[88, 72, 91, 65, 80].map((w, i) => (
          <div
            key={i}
            className="h-3 rounded-lg bg-neutral-200 dark:bg-neutral-800"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    )
  }

  function handleDelete() {
    if (!confirm('¿Eliminar este currículum?')) return
    remove(id, { onSuccess: onClear })
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900">
      {/* Panel header */}
      <div className="flex items-start justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
              style={{ background: 'linear-gradient(135deg,#A855F7,#6366F1)' }}
            >
              <Sparkles className="w-2.5 h-2.5" />
              Generado con IA
            </span>
          </div>
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            {cv.jobOfferTitle ?? 'Currículum'}
          </h2>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-2 rounded-lg hover:bg-danger-50 dark:hover:bg-red-900/20 text-neutral-400 hover:text-danger-500 disabled:opacity-50 transition-colors"
          title="Eliminar"
        >
          {deleting
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Trash2 className="w-4 h-4" />
          }
        </button>
      </div>
      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
        <CurriculumDisplay content={cv.content} compact />
      </div>
    </div>
  )
}

//  Empty right panel 

function EmptyRight() {
  return (
    <div className="hidden lg:flex flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-950">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3">
          <Search className="w-7 h-7 text-neutral-300 dark:text-neutral-600" />
        </div>
        <p className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
          Seleccioná un currículum para verlo
        </p>
      </div>
    </div>
  )
}

//  Page 

function CurriculaPageContent() {
  const { selectedId, selectItem, clearSelection } = useAIParams()

  return (
    <div className="flex h-full overflow-hidden">

      {/* Left panel — hidden on mobile when item selected */}
      <div className={cn(
        'flex-col overflow-hidden border-r border-neutral-200 dark:border-neutral-800',
        selectedId !== null
          ? 'hidden lg:flex lg:w-[38%]'
          : 'flex w-full lg:w-[38%]',
      )}>
        <AILeftPanel
          section="curricula"
          selectedId={selectedId}
          onSelect={selectItem}
        />
      </div>

      {/* Right panel */}
      {selectedId !== null ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Mobile back button */}
          <button
            onClick={clearSelection}
            className="lg:hidden flex items-center gap-2 px-4 py-3 text-xs font-medium text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shrink-0 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            ← Volver al listado
          </button>
          <div className="flex-1 min-h-0 overflow-hidden">
            <CurriculumPanel id={selectedId} onClear={clearSelection} />
          </div>
        </div>
      ) : (
        <EmptyRight />
      )}
    </div>
  )
}

export default function CurriculaPage() {
  return (
    <Suspense>
      <CurriculaPageContent />
    </Suspense>
  )
}
