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
        set({ accessToken, refreshToken })
      },

      logout: () => {
        tokenStorage.clear()
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
