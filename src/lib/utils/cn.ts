import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges Tailwind classes safely — resolves conflicts and de-dupes.
 * Drop-in replacement for clsx in this codebase.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
