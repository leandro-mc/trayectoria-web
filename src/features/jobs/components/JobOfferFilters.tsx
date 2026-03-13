'use client'

import { Search, X } from 'lucide-react'
import { WORK_MODE_LABELS, JOB_TYPE_LABELS } from '@/config/constants'
import type { WorkMode, JobType } from '@/types/global.types'
import type { ListJobOffersParams } from '../types/jobs.types'

interface JobOfferFiltersProps {
  filters:   ListJobOffersParams
  onChange:  (filters: ListJobOffersParams) => void
}

//  Checkbox group 

interface CheckboxGroupProps<T extends string> {
  label:    string
  options:  { value: T; label: string }[]
  selected: T | undefined
  onChange: (value: T | undefined) => void
}

function CheckboxGroup<T extends string>({
  label, options, selected, onChange,
}: CheckboxGroupProps<T>) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">
        {label}
      </p>
      <div className="space-y-1.5">
        {options.map(({ value, label: optLabel }) => (
          <label
            key={value}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={selected === value}
              onChange={() => onChange(selected === value ? undefined : value)}
              className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 text-brand-500 focus:ring-brand-500 focus:ring-offset-0"
            />
            <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200 transition-colors">
              {optLabel}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

//  Main component 

const WORK_MODE_OPTIONS = (Object.keys(WORK_MODE_LABELS) as WorkMode[]).map((v) => ({
  value: v,
  label: WORK_MODE_LABELS[v],
}))

const JOB_TYPE_OPTIONS = (Object.keys(JOB_TYPE_LABELS) as JobType[]).map((v) => ({
  value: v,
  label: JOB_TYPE_LABELS[v],
}))

export function JobOfferFilters({ filters, onChange }: JobOfferFiltersProps) {
  const hasActiveFilters =
    !!filters.keyword || !!filters.workMode || !!filters.jobType

  function clearAll() {
    onChange({ page: 0 })
  }

  return (
    <aside className="space-y-6">

      {/*  Search  */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">
          Buscar
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={filters.keyword ?? ''}
            onChange={(e) =>
              onChange({ ...filters, keyword: e.target.value || undefined, page: 0 })
            }
            placeholder="Título del puesto..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
      </div>

      {/*  Work mode  */}
      <CheckboxGroup
        label="Modalidad"
        options={WORK_MODE_OPTIONS}
        selected={filters.workMode}
        onChange={(v) => onChange({ ...filters, workMode: v, page: 0 })}
      />

      {/*  Job type  */}
      <CheckboxGroup
        label="Jornada"
        options={JOB_TYPE_OPTIONS}
        selected={filters.jobType}
        onChange={(v) => onChange({ ...filters, jobType: v, page: 0 })}
      />

      {/*  Clear  */}
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 text-sm text-danger-500 hover:text-danger-600 dark:text-danger-400 font-medium transition-colors"
        >
          <X className="w-4 h-4" />
          Limpiar filtros
        </button>
      )}

    </aside>
  )
}
