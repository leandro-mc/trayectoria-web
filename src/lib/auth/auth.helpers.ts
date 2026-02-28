import type { AuthResponse } from '@/types/api.types'
import { tokenStorage } from './token.storage'

/**
 * Decodes the payload of a JWT without verifying the signature.
 * Used client-side only for reading expiry / role — NOT for security.
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts && parts.length !== 3) return null
    const payload = parts[1]
    if (!payload) return null
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded) as Record<string, unknown>
  } catch {
    return null
  }
}

/**
 * Returns true if the access token is expired (or absent).
 */
export function isAccessTokenExpired(): boolean {
  const token = tokenStorage.getAccessToken()
  if (!token) return true

  const payload = decodeJwtPayload(token)
  if (!payload || typeof payload['exp'] !== 'number') return true

  // exp is in seconds; Date.now() in milliseconds
  return payload['exp'] * 1000 < Date.now()
}

/**
 * Persists new tokens from an AuthResponse to storage.
 */
export function persistAuthResponse(auth: AuthResponse): void {
  tokenStorage.setAccessToken(auth.accessToken)
  tokenStorage.setRefreshToken(auth.refreshToken)
}
