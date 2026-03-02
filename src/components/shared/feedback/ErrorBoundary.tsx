'use client'

import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children:  ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error:    Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // In production this should go to a monitoring service (Sentry, etc.)
    console.error('[ErrorBoundary]', error, info)
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-danger-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-danger-500" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Algo salió mal
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-6">
            Ocurrió un error inesperado. Podés intentar recargar la sección.
          </p>
          <Button onClick={this.handleReset} className="bg-brand-500 hover:bg-brand-600 text-white">
            Reintentar
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

//  Inline API error state 

interface InlineErrorProps {
  message:    string
  onRetry?:   () => void
}

export function InlineError({ message, onRetry }: InlineErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
      <div className="w-12 h-12 rounded-xl bg-danger-50 dark:bg-red-900/20 flex items-center justify-center mb-3">
        <AlertTriangle className="w-6 h-6 text-danger-500" />
      </div>
      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
        Error al cargar
      </p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mb-4">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  )
}
