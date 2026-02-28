import {
  format,
  formatDistanceToNow,
  parseISO,
  isValid,
  differenceInMonths,
  differenceInYears,
} from 'date-fns'
import { es } from 'date-fns/locale'

const LOCALE = { locale: es }

/**
 * Formats a date string (ISO 8601 or YYYY-MM-DD) for display.
 * Returns '-' if the date is invalid or null/undefined.
 */
export function formatDate(
  dateStr: string | null | undefined,
  pattern: string = 'dd MMM yyyy',
): string {
  if (!dateStr) return '-'
  const date = parseISO(dateStr)
  if (!isValid(date)) return '-'
  return format(date, pattern, LOCALE)
}

/**
 * Returns a relative time string like "hace 3 días".
 */
export function formatRelative(dateStr: string | null | undefined): string {
  if (!dateStr) return '-'
  const date = parseISO(dateStr)
  if (!isValid(date)) return '-'
  return formatDistanceToNow(date, { addSuffix: true, ...LOCALE })
}

/**
 * Formats a work experience period, e.g. "Mar 2021 – Actual (2 años 4 meses)"
 */
export function formatPeriod(
  startDate: string | null,
  endDate:   string | null,
  isCurrent: boolean,
): string {
  const start = startDate ? formatDate(startDate, 'MMM yyyy') : '?'
  const end   = isCurrent ? 'Actual' : endDate ? formatDate(endDate, 'MMM yyyy') : '?'

  let duration = ''
  if (startDate) {
    const from = parseISO(startDate)
    const to   = endDate && !isCurrent ? parseISO(endDate) : new Date()

    if (isValid(from) && isValid(to)) {
      const years  = differenceInYears(to, from)
      const months = differenceInMonths(to, from) % 12

      const parts: string[] = []
      if (years  > 0) parts.push(`${years} ${years  === 1 ? 'año'  : 'años'}`)
      if (months > 0) parts.push(`${months} ${months === 1 ? 'mes' : 'meses'}`)
      if (parts.length) duration = ` (${parts.join(' ')})`
    }
  }

  return `${start} – ${end}${duration}`
}

/**
 * Formats an ISO 8601 datetime for display in a chat/feed context.
 * e.g. "hoy a las 14:32"
 */
export function formatChatTime(dateStr: string): string {
  const date = parseISO(dateStr)
  if (!isValid(date)) return ''
  return format(date, "HH:mm", LOCALE)
}
