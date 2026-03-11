'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import type { WorkMode, JobType } from '@/types/global.types'
import type { ListJobOffersParams } from '../types/jobs.types'

export type JobsMode = 'cv' | 'interview'

// Validate that a string is a valid WorkMode — URL params are always strings
function toWorkMode(value: string): WorkMode | undefined {
  const valid: WorkMode[] = ['REMOTE', 'HYBRID', 'ON_SITE']
  return valid.includes(value as WorkMode) ? (value as WorkMode) : undefined
}

function toJobType(value: string): JobType | undefined {
  const valid: JobType[] = ['FULL_TIME', 'PART_TIME', 'INTERNSHIP']
  return valid.includes(value as JobType) ? (value as JobType) : undefined
}

// Single hook that owns all URL state for /jobs.
// Components never touch useSearchParams directly — everything goes through here.
export function useJobsParams() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  //  Read 

  const selectedId = searchParams.get('id')
    ? Number(searchParams.get('id'))
    : null

  const mode     = searchParams.get('mode') as JobsMode | null
  const workMode = toWorkMode(searchParams.get('workMode') ?? '')
  const jobType  = toJobType(searchParams.get('jobType')   ?? '')
  const keyword  = searchParams.get('q')    ?? undefined
  const page     = searchParams.get('page') ? Number(searchParams.get('page')) : 0

  const isAIMode = mode === 'cv' || mode === 'interview'

  // Typed params ready to pass directly into useJobOffers — no conversion needed
  const filterParams: ListJobOffersParams = {
    keyword,
    workMode,
    jobType,
    page,
  }

  //  Write 

  const push = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === '') params.delete(key)
      else params.set(key, value)
    }
    router.replace(`/jobs?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  const selectJob = useCallback((id: number) => {
    push({ id: String(id), mode: null })
  }, [push])

  const setMode = useCallback((m: JobsMode) => {
    push({ mode: m })
  }, [push])

  const goBackToList = useCallback(() => {
    push({ id: null, mode: null })
  }, [push])

  const goBackToDetail = useCallback(() => {
    push({ mode: null })
  }, [push])

  // key must match a URL param name: 'q' | 'workMode' | 'jobType'
  const setFilter = useCallback((key: string, value: string) => {
    push({ [key]: value || null, page: null, id: null, mode: null })
  }, [push])

  const setPage = useCallback((p: number) => {
    push({ page: p === 0 ? null : String(p) })
  }, [push])

  return {
    // State
    selectedId,
    mode,
    isAIMode,
    filterParams,   // pass directly to useJobOffers
    // Individual values — for filter UI display
    keyword:  keyword  ?? '',
    workMode: workMode ?? '' as WorkMode | '',
    jobType:  jobType  ?? '' as JobType  | '',
    page,
    // Actions
    selectJob,
    setMode,
    goBackToList,
    goBackToDetail,
    setFilter,
    setPage,
  }
}
