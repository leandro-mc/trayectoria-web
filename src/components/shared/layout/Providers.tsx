'use client'

// Import interceptors synchronously so they are registered before ANY request
// fires — including requests triggered by child effects on first render.
// There is no circular dependency: Providers does not export anything that
// interceptors.ts imports; the import is purely a side effect.
import '@/lib/api/interceptors'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useEffect, useRef, type ReactNode } from 'react'
import { useUIStore } from '@/stores/ui.store'
import { useBootstrapAuth } from '@/features/auth/hooks/useBootstrapAuth'

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

//  Auth bootstrap gate 
// Blocks rendering until the silent token refresh (or hydration check) completes.
// This prevents query components from firing requests with no access token.
//
// Visible duration:
//   - Same session (token in sessionStorage): ~0ms (resolves synchronously after hydration)
//   - Browser reopened (sessionStorage cleared): one network round-trip (~200–400ms)
//   - Not authenticated: ~0ms

function AuthBootstrapGate({ children }: { children: ReactNode }) {
  const ready = useBootstrapAuth()

  if (!ready) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div
          className="w-8 h-8 rounded-full animate-spin border-2"
          style={{ borderColor: '#6366F1', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  return <>{children}</>
}

//  Providers 

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const clientRef = useRef<QueryClient | null>(null)
  if (!clientRef.current) clientRef.current = makeQueryClient()

  return (
    <QueryClientProvider client={clientRef.current}>
      <ThemeSync />
      <AuthBootstrapGate>
        {children}
      </AuthBootstrapGate>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
