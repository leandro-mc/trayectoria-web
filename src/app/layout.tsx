import type { Metadata } from 'next'
import '@fontsource-variable/inter'
import './globals.css'
import { Providers } from '@/components/shared/layout/Providers'

export const metadata: Metadata = {
  title: {
    default:  'TrayectorIA — Tu carrera, impulsada por IA',
    template: '%s | TrayectorIA',
  },
  description:
    'Plataforma de networking laboral potenciada por inteligencia artificial. Conectamos candidatos con empresas.',
  keywords: ['empleos', 'trabajo', 'IA', 'currículum', 'entrevistas', 'networking'],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
