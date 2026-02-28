// Attach this once at application bootstrap (root layout or providers).
// Separated from client.ts so the store import doesn't create circular deps.

import type { InternalAxiosRequestConfig, AxiosError } from 'axios'
import { apiClient } from './client'
import { tokenStorage } from '@/lib/auth/token.storage'
import type { AuthResponse } from '@/types/api.types'

//  Internal state for refresh coordination 

let isRefreshing = false
let refreshQueue: Array<{
  resolve: (token: string) => void
  reject:  (err: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null): void {
  refreshQueue.forEach((p) => {
    if (error) p.reject(error)
    else       p.resolve(token!)
  })
  refreshQueue = []
}

//  Request interceptor — attach Bearer token 

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = tokenStorage.getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: unknown) => Promise.reject(error),
)

//  Response interceptor — handle 401 with token refresh 

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    const refreshToken = tokenStorage.getRefreshToken()
    if (!refreshToken) {
      forceLogout()
      return Promise.reject(error)
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        refreshQueue.push({ resolve, reject })
      }).then((newToken) => {
        original.headers!.Authorization = `Bearer ${newToken}`
        return apiClient(original)
      })
    }

    original._retry = true
    isRefreshing = true

    try {
      const { data } = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken })

      tokenStorage.setAccessToken(data.accessToken)
      tokenStorage.setRefreshToken(data.refreshToken)

      // Update the Zustand store lazily to avoid circular imports at module load
      void import('@/stores/auth.store.js').then(({ useAuthStore }) => {
        useAuthStore.getState().setTokens({
          accessToken:  data.accessToken,
          refreshToken: data.refreshToken,
        })
      })

      processQueue(null, data.accessToken)
      original.headers!.Authorization = `Bearer ${data.accessToken}`
      return apiClient(original)
    } catch (refreshError) {
      processQueue(refreshError, null)
      forceLogout()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

function forceLogout(): void {
  tokenStorage.clear()

  // Lazy store reset to avoid circular deps
  void import('@/stores/auth.store.js').then(({ useAuthStore }) => {
    useAuthStore.getState().logout()
  })

  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}
