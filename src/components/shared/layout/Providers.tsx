'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useEffect, useRef, type ReactNode } from 'react'
import { useUIStore } from '@/stores/ui.store'

//  Query Client factory 

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime:          1_000 * 60 * 2,   // 2 minutes
        gcTime:             1_000 * 60 * 10,  // 10 minutes
        retry:              1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  })
}

//  Theme sync 

function ThemeSync(): null {
  const theme = useUIStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
    } else {
      // System
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', prefersDark)
    }
  }, [theme])

  return null
}

//  Interceptors boot 
// Ensures Axios interceptors are registered exactly once on the client.

let interceptorsRegistered = false

function useBootInterceptors(): void {
  useEffect(() => {
    if (!interceptorsRegistered) {
      interceptorsRegistered = true
      void import('@/lib/api/interceptors') // side-effect import
    }
  }, [])
}

//  Providers 

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const clientRef = useRef<QueryClient | null>(null)
  if (!clientRef.current) clientRef.current = makeQueryClient()

  useBootInterceptors()

  return (
    <QueryClientProvider client={clientRef.current}>
      <ThemeSync />
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
