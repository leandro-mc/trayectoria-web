import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { tokenStorage } from '@/lib/auth/token.storage'
import type { UserRole } from '@/types/global.types'

//  Types 

interface AuthUser {
  email: string
  role: UserRole
}

interface AuthTokens {
  accessToken: string
  refreshToken: string
}

interface AuthState {
  user:            AuthUser | null
  accessToken:     string | null
  refreshToken:    string | null
  isAuthenticated: boolean
}

interface AuthActions {
  setAuth:   (user: AuthUser, tokens: AuthTokens) => void
  setTokens: (tokens: AuthTokens) => void
  logout:    () => void
}

type AuthStore = AuthState & AuthActions

//  Cookie helper
// The proxy.ts runs on the server and can only read cookies — not localStorage.
// We mirror the minimal auth state to a cookie so the proxy can protect routes.

const COOKIE_NAME = 'trayectoria-auth'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function writeAuthCookie(user: AuthUser, refreshToken: string): void {
  if (typeof document === 'undefined') return
  const value = encodeURIComponent(
    JSON.stringify({
      state: { isAuthenticated: true, user, refreshToken },
    }),
  )
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

function clearAuthCookie(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`
}

//  Initial state 

const initialState: AuthState = {
  user:            null,
  accessToken:     null,
  refreshToken:    null,
  isAuthenticated: false,
}

//  Store 

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      setAuth: (user, { accessToken, refreshToken }) => {
        // Access token lives in sessionStorage (cleared on tab close)
        tokenStorage.setAccessToken(accessToken)
        tokenStorage.setRefreshToken(refreshToken)
        // Mirror to cookie so proxy.ts can read it server-side
        writeAuthCookie(user, refreshToken)

        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        })
      },

      setTokens: ({ accessToken, refreshToken }) => {
        tokenStorage.setAccessToken(accessToken)
        tokenStorage.setRefreshToken(refreshToken)
        // Update cookie with new refresh token
        const currentUser = useAuthStore.getState().user
        if (currentUser) writeAuthCookie(currentUser, refreshToken)
        set({ accessToken, refreshToken })
      },

      logout: () => {
        tokenStorage.clear()
        clearAuthCookie()
        set(initialState)
      },
    }),
    {
      name:    'trayectoria-auth',
      storage: createJSONStorage(() => localStorage),
      // Persist user + refresh token only.
      // Access token is kept in sessionStorage via tokenStorage.
      partialize: (state) => ({
        user:            state.user,
        refreshToken:    state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

//  Selectors 

export const selectUser            = (s: AuthStore) => s.user
export const selectIsAuthenticated = (s: AuthStore) => s.isAuthenticated
export const selectRole            = (s: AuthStore) => s.user?.role ?? null
export const selectIsCandidate     = (s: AuthStore) => s.user?.role === 'CANDIDATE'
export const selectIsCompany       = (s: AuthStore) => s.user?.role === 'COMPANY'
