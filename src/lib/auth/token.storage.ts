// Centralizes all token read/write operations.
// The Zustand store is the source of truth at runtime; this module
// handles the persistence bridge (cookies for SSR / localStorage for CSR).

const ACCESS_TOKEN_KEY  = 'trayectoria_access'
const REFRESH_TOKEN_KEY = 'trayectoria_refresh'

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

export const tokenStorage = {
  getAccessToken(): string | null {
    if (!isBrowser()) return null
    return sessionStorage.getItem(ACCESS_TOKEN_KEY)
  },

  setAccessToken(token: string): void {
    if (!isBrowser()) return
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token)
  },

  getRefreshToken(): string | null {
    if (!isBrowser()) return null
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  setRefreshToken(token: string): void {
    if (!isBrowser()) return
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  },

  clear(): void {
    if (!isBrowser()) return
    sessionStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}
