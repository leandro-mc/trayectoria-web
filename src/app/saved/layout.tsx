// /saved needs the same full-height split-panel shell as /jobs.
// It cannot use (candidate)/layout.tsx because that wraps content in a
// scrollable padded container — split panels require overflow-hidden + h-full.
import type { ReactNode } from 'react'
import { JobsShell } from '@/features/jobs/components/JobsShell'

export default function SavedLayout({ children }: { children: ReactNode }) {
  return <JobsShell>{children}</JobsShell>
}
