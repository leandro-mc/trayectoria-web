
// Fix:
//   1. Wait for Zustand persist hydration to complete (onFinishHydration /
//      hasHydrated) before reading auth state.
//   2. Use getState() imperatively — always reflects current hydrated state.
//   3. Use raw fetch() for the refresh call (not apiClient) to completely
//      bypass Axios interceptors during bootstrap.

'use client'

import { useEffect, useState } from 'react'
import { tokenStorage } from '@/lib/auth/token.storage'
import { useAuthStore } from '@/stores/auth.store'
import type { AuthResponse } from '@/types/api.types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'

// Waits for Zustand's persist middleware to finish reading from localStorage.
// For synchronous storage (localStorage) this is effectively a no-op — hasHydrated()
// returns true immediately. The await is a safety net for any edge case where
// the hydration callback fires after effects (e.g., custom storage implementations).
function waitForHydration(): Promise<void> {
  if (useAuthStore.persist.hasHydrated()) return Promise.resolve()
  return new Promise<void>((resolve) => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      unsub()
      resolve()
    })
  })
}

export function useBootstrapAuth(): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function init() {
      // Step 1 — ensure Zustand has hydrated from localStorage before reading state
      await waitForHydration()
      if (cancelled) return

      // Step 2 — read imperatively (not from the reactive closure which may be stale)
      const { isAuthenticated, refreshToken: storeRefreshToken, setTokens, logout } =
        useAuthStore.getState()

      // Not authenticated — nothing to do, open gate immediately
      if (!isAuthenticated) {
        setReady(true)
        return
      }

      // Access token still in sessionStorage (same browser session) — no refresh needed
      if (tokenStorage.getAccessToken()) {
        setReady(true)
        return
      }

      // Access token gone (browser was closed). Check for refresh token.
      // storeRefreshToken comes from Zustand persist (trayectoria-auth key).
      // tokenStorage.getRefreshToken() is the fallback (trayectoria_refresh key).
      // Both are written together on login / token rotation so they stay in sync.
      const refreshToken = storeRefreshToken ?? tokenStorage.getRefreshToken()

      if (!refreshToken) {
        // No refresh token — stale auth state, clean up and send to login
        logout()
        setReady(true)
        return
      }

      // Step 3 — silent refresh with raw fetch() — completely bypasses Axios
      // interceptors so there's no risk of the 401 handler triggering during bootstrap.
      try {
        const res = await fetch(`${API_BASE}/v1/auth/refresh`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ refreshToken }),
        })

        if (!res.ok) throw new Error(`Refresh failed: ${res.status}`)

        const data = (await res.json()) as AuthResponse
        if (!cancelled) {
          // setTokens writes to sessionStorage + localStorage + cookie
          setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken })
        }
      } catch {
        // Refresh token expired or server error — force clean logout
        if (!cancelled) logout()
      } finally {
        if (!cancelled) setReady(true)
      }
    }

    void init()

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Intentionally empty — runs exactly once on mount

  return ready
}
