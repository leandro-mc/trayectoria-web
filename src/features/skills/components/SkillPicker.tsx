'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { useSkillsCatalog } from '../hooks/useSkillsCatalog'
import type { SkillResponse } from '@/types/api.types'
import { cn } from '@/lib/utils/cn'

interface SkillPickerProps {
  // Skills the candidate already has
  selected:  SkillResponse[]
  onAdd:     (skill: SkillResponse) => void
  onRemove:  (skillId: number) => void
  disabled?: boolean
}

export function SkillPicker({
  selected,
  onAdd,
  onRemove,
  disabled = false,
}: SkillPickerProps) {
  const [search, setSearch]   = useState('')
  const [open, setOpen]       = useState(false)
  const containerRef          = useRef<HTMLDivElement>(null)
  const inputRef              = useRef<HTMLInputElement>(null)

  const { data: catalog = [], isLoading } = useSkillsCatalog(search)

  const selectedIds = new Set(selected.map((s) => s.id))

  // Filter out already selected skills from suggestions
  const suggestions = catalog.filter((s) => !selectedIds.has(s.id))

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(skill: SkillResponse) {
    onAdd(skill)
    setSearch('')
    setOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div className="space-y-3">

      {/*  Selected skills as tags  */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((skill) => (
            <span
              key={skill.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 text-xs font-medium text-brand-700 dark:text-brand-300"
            >
              {skill.name}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => onRemove(skill.id)}
                  className="text-brand-400 hover:text-brand-600 dark:hover:text-brand-200 transition-colors"
                  aria-label={`Quitar ${skill.name}`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/*  Search input + dropdown  */}
      {!disabled && (
        <div ref={containerRef} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            {isLoading && search.length >= 2 && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 animate-spin" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setOpen(true)
              }}
              onFocus={() => setOpen(true)}
              placeholder="Buscar y agregar skills..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          {/* Dropdown */}
          {open && suggestions.length > 0 && (
            <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-modal overflow-hidden">
              <ul className="max-h-52 overflow-y-auto py-1">
                {suggestions.slice(0, 10).map((skill) => (
                  <li key={skill.id}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        // mousedown fires before blur — prevent input from losing focus
                        e.preventDefault()
                        handleSelect(skill)
                      }}
                      className={cn(
                        'w-full text-left px-4 py-2.5 text-sm flex items-center justify-between gap-3',
                        'hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors',
                        'text-neutral-800 dark:text-neutral-200',
                      )}
                    >
                      <span>{skill.name}</span>
                      {skill.type && (
                        <span className="text-xs text-neutral-400 shrink-0">
                          {skill.type.toLowerCase()}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* No results */}
          {open && search.length >= 2 && !isLoading && suggestions.length === 0 && (
            <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-card p-4 text-center">
              <p className="text-sm text-neutral-400">
                No se encontraron skills para "{search}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
