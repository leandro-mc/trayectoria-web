import type { ApiError } from '@/types/api.types'
import { AxiosError } from 'axios'

/**
 * Extracts a human-readable error message from an Axios error.
 * Falls back to a generic message if the error structure is unexpected.
 */
export function extractApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as Partial<ApiError> | undefined

    if (data?.message) return data.message

    // Validation errors: join details array
    if (Array.isArray(data?.details) && data.details.length > 0) {
      return data.details.join('. ')
    }

    if (error.response?.status === 401) return 'Sesión expirada. Iniciá sesión nuevamente.'
    if (error.response?.status === 403) return 'No tenés permisos para realizar esta acción.'
    if (error.response?.status === 404) return 'El recurso solicitado no fue encontrado.'
    if (error.response?.status === 409) return data?.message ?? 'Ya existe un registro con esos datos.'
    if (error.response?.status === 422) return data?.message ?? 'La operación no es válida en este momento.'
    if (error.code === 'ECONNABORTED') return 'La solicitud tardó demasiado. Verificá tu conexión.'
    if (!error.response)               return 'Sin conexión. Verificá tu red e intentá de nuevo.'
  }

  return 'Ocurrió un error inesperado. Intentá de nuevo.'
}

/**
 * Capitalizes the first letter of a string.
 */
export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Truncates a string to maxLength and appends '…' if needed.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 1) + '…'
}

/**
 * Returns initials from a name string, e.g. "Ana García" → "AG"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}

/**
 * Formats a number with thousands separator, e.g. 1200 → "1.200"
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('es-AR').format(n)
}
