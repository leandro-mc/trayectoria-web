import type { ReactNode } from 'react'
import { CandidateSidebar } from '@/components/shared/layout/CandidateSidebar'
import { MobileBottomNav } from '@/components/shared/layout/MobileBottomNav'

interface CandidateLayoutProps {
  children: ReactNode
}

export default function CandidateLayout({ children }: CandidateLayoutProps) {
  return (
    // h-dvh: iOS Safari-safe. h-screen = 100vh que incluye la address bar → nav se va abajo.
    <div className="flex h-dvh bg-neutral-50 dark:bg-neutral-950 overflow-hidden">

      {/* Desktop sidebar — display:none en mobile */}
      <CandidateSidebar />

      {/* Columna de contenido: flex-col para que el nav quede al final */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/*
          min-h-0 es obligatorio en flex children con overflow.
          Sin él, el navegador le da min-height: auto y el div puede crecer
          más allá del contenedor, aplastando MobileBottomNav a 0px.
        */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <main className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-5xl w-full mx-auto">
            {children}
          </main>
        </div>

        {/* Nav en flujo normal — shrink-0 interno garantiza que nunca se comprima */}
        <MobileBottomNav />
      </div>

    </div>
  )
}
