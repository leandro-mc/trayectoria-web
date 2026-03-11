'use client'

import type { ReactNode } from 'react'
import { JobsShell } from '@/features/jobs/components/JobsShell'

export default function JobsLayout({ children }: { children: ReactNode }) {
  return <JobsShell>{children}</JobsShell>
}