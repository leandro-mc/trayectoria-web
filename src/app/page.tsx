'use client'

import { useState } from 'react'
import { Sparkles, Briefcase, Search, BookOpen, Building2, Zap, Shield, Users, Sun, Moon } from 'lucide-react'

import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/jobs')
}

//  Theme toggle (local, no store dependency for the preview) 

function ThemeToggle() {
  const [dark, setDark] = useState(
    typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  )

  function toggle() {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    setDark(next)
  }

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm font-medium transition-colors"
      aria-label="Cambiar tema"
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      {dark ? 'Claro' : 'Oscuro'}
    </button>
  )
}

//  Helpers 

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Swatch({ label, bg }: { label: string; bg: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-12 h-12 rounded-xl shadow-card" style={{ background: bg }} />
      <span className="text-xs text-neutral-500 dark:text-neutral-400">{label}</span>
    </div>
  )
}

function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-card ${className}`}>
      {children}
    </div>
  )
}

//  Page 

export function DesignSystemPreview() {
  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">

      {/*  Header  */}
      <div className="sticky top-0 z-10 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #A855F7, #6366F1)' }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">TrayectorIA</span>
              <span className="ml-2 text-xs text-neutral-400">Design System Preview</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              feat/project-setup
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/*  Colors  */}
        <Section title="Color Palette">
          <div className="space-y-6">

            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-3">
                Brand — Índigo <span className="text-neutral-400 font-normal">(acciones principales, navegación, CTA)</span>
              </p>
              <div className="flex gap-3 flex-wrap">
                {[
                  ['50',  '#EEF2FF'], ['100', '#E0E7FF'], ['200', '#C7D2FE'],
                  ['300', '#A5B4FC'], ['400', '#818CF8'], ['500', '#6366F1'],
                  ['600', '#4F46E5'], ['700', '#4338CA'], ['800', '#3730A3'], ['900', '#312E81'],
                ].map(([label, bg]) => <Swatch key={label} label={label as string} bg={bg as string} />)}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-3">
                AI Accent — Violeta <span className="text-neutral-400 font-normal">(features de IA, badges, degradados)</span>
              </p>
              <div className="flex gap-3">
                <Swatch label="400" bg="#C084FC" />
                <Swatch label="500" bg="#A855F7" />
                <Swatch label="600" bg="#9333EA" />
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl shadow-card" style={{ background: 'linear-gradient(135deg, #A855F7, #6366F1)' }} />
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">gradient</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-3">Semánticos</p>
              <div className="flex gap-3">
                <Swatch label="success" bg="#22C55E" />
                <Swatch label="warning" bg="#F59E0B" />
                <Swatch label="danger"  bg="#F43F5E" />
              </div>
            </div>

          </div>
        </Section>

        {/*  Typography  */}
        <Section title="Typography — Inter Variable">
          <div className="space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-xs text-neutral-400 w-12 shrink-0">4xl</span>
              <p className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">Tu próximo trabajo, impulsado por IA</p>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-xs text-neutral-400 w-12 shrink-0">2xl</span>
              <p className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">Conectamos candidatos con empresas</p>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-xs text-neutral-400 w-12 shrink-0">xl</span>
              <p className="text-xl font-medium text-neutral-700 dark:text-neutral-300">Catálogo de ofertas laborales</p>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-xs text-neutral-400 w-12 shrink-0">base</span>
              <p className="text-base text-neutral-600 dark:text-neutral-400">La IA analiza tu perfil y genera un currículum personalizado para cada oferta de trabajo.</p>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-xs text-neutral-400 w-12 shrink-0">sm</span>
              <p className="text-sm text-neutral-500 dark:text-neutral-500">San José, Costa Rica · Remoto · Hace 3 días</p>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-xs text-neutral-400 w-12 shrink-0">xs</span>
              <p className="text-xs text-neutral-400 dark:text-neutral-600 uppercase tracking-widest font-semibold">Label / Badge / Caption</p>
            </div>
          </div>
        </Section>

        {/*  Buttons  */}
        <Section title="Buttons">
          <div className="flex flex-wrap gap-3 items-center">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors">
              Postularme
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-medium transition-colors">
              Ver perfil
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90" style={{ background: 'linear-gradient(135deg, #A855F7, #6366F1)' }}>
              <Sparkles className="w-4 h-4" />
              Generar con IA
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm font-medium transition-colors">
              Editar
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-danger-500 hover:bg-danger-600 text-white text-sm font-medium transition-colors">
              Eliminar
            </button>
          </div>
        </Section>

        {/*  Badges  */}
        <Section title="Badges & Status">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-neutral-400 w-28">Ofertas</span>
              <Badge className="bg-success-50 text-success-600 dark:bg-green-900/20 dark:text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-success-500" /> Activa
              </Badge>
              <Badge className="bg-danger-50 text-danger-600 dark:bg-red-900/20 dark:text-red-400">
                <span className="w-1.5 h-1.5 rounded-full bg-danger-500" /> Cerrada
              </Badge>
              <Badge className="bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">Borrador</Badge>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-neutral-400 w-28">Modo trabajo</span>
              <Badge className="bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400">Remoto</Badge>
              <Badge className="bg-warning-50 text-warning-600">Híbrido</Badge>
              <Badge className="bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">Presencial</Badge>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-neutral-400 w-28">Postulaciones</span>
              <Badge className="bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">Pendiente</Badge>
              <Badge className="bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400">Visto</Badge>
              <Badge className="bg-warning-50 text-warning-600">En revisión</Badge>
              <Badge className="bg-success-50 text-success-600 dark:bg-green-900/20 dark:text-green-400">Aceptado</Badge>
              <Badge className="bg-danger-50 text-danger-600 dark:bg-red-900/20 dark:text-red-400">Rechazado</Badge>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-neutral-400 w-28">IA</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white" style={{ background: 'linear-gradient(135deg, #A855F7, #6366F1)' }}>
                <Sparkles className="w-3 h-3" /> Powered by AI
              </span>
            </div>
          </div>
        </Section>

        {/*  Cards  */}
        <Section title="Cards">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Job card */}
            <Card className="hover:shadow-card-hover transition-shadow duration-200 cursor-pointer group">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/50 transition-colors">
                  <Building2 className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">TechCorp</p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Desarrollador Backend Senior</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                <Badge className="bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400">Remoto</Badge>
                <Badge className="bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">Tiempo completo</Badge>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {['Kotlin', 'Spring Boot', 'Docker'].map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 font-mono">{s}</span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Hace 2 días</span>
                <span className="text-xs font-medium text-brand-600 dark:text-brand-400">Ver oferta →</span>
              </div>
            </Card>

            {/* AI card */}
            <div className="rounded-xl p-6 border border-brand-200 dark:border-brand-800" style={{ background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #A855F7, #6366F1)' }}>
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">Currículum con IA</p>
                  <p className="text-xs text-ai-600">Powered by AI</p>
                </div>
              </div>
              <p className="text-sm text-neutral-600 mb-4">
                Generá un CV personalizado para cada oferta en segundos.
              </p>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium w-full justify-center hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, #A855F7, #6366F1)' }}>
                <Sparkles className="w-4 h-4" /> Generar currículum
              </button>
            </div>

          </div>
        </Section>

        {/*  Skeletons  */}
        <Section title="Skeleton Loaders">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Card>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-800 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse w-2/5" />
                  <div className="h-4 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse w-3/4" />
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <div className="h-5 w-14 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                <div className="h-5 w-24 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              </div>
              <div className="flex gap-2">
                {[20, 24, 16].map((w) => (
                  <div key={w} className="h-5 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" style={{ width: `${w * 4}px` }} />
                ))}
              </div>
            </Card>

            <div className="rounded-xl p-6 border border-ai-200 dark:border-ai-900/50" style={{ background: 'linear-gradient(135deg, #F5F3FF33, #EEF2FF33)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full animate-pulse flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #A855F7, #6366F1)' }}>
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium text-ai-600 dark:text-ai-400">La IA está generando tu currículum...</span>
              </div>
              <div className="space-y-2">
                {[85, 70, 60, 50].map((w) => (
                  <div key={w} className="h-3 rounded" style={{ width: `${w}%`, background: 'linear-gradient(90deg, #e5e7eb, #f3f4f6, #e5e7eb)', backgroundSize: '200% 100%', animation: 'shimmer 2s infinite' }} />
                ))}
              </div>
            </div>

          </div>
        </Section>

        {/*  Empty state  */}
        <Section title="Empty State">
          <Card>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                <Briefcase className="w-7 h-7 text-neutral-400 dark:text-neutral-500" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1">No hay postulaciones aún</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs mb-5">
                Explorá el catálogo de ofertas y postulate a las que más te interesen.
              </p>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors">
                <Search className="w-4 h-4" /> Buscar empleos
              </button>
            </div>
          </Card>
        </Section>

        {/*  Architecture map  */}
        <Section title="Architecture — Feature Modules">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: Shield,    label: 'auth',         desc: 'JWT · refresh · stores'       },
              { icon: Users,     label: 'candidate',    desc: 'Perfil · skills · idiomas'    },
              { icon: Building2, label: 'company',      desc: 'Perfil · logo · industria'    },
              { icon: Briefcase, label: 'jobs',         desc: 'Catálogo · filtros · detalle' },
              { icon: BookOpen,  label: 'applications', desc: 'Estado · historial'            },
              { icon: Sparkles,  label: 'ai',           desc: 'CV generado · entrevistas'    },
              { icon: Search,    label: 'saved-offers', desc: 'Bookmark · listado'            },
              { icon: Zap,       label: 'skills',       desc: 'Catálogo · autocomplete'      },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                </div>
                <div>
                  <p className="text-sm font-mono font-semibold text-brand-600 dark:text-brand-400">{label}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <div className="text-center pt-4 pb-8 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-xs text-neutral-400 dark:text-neutral-600 font-mono">
            TrayectorIA · feat/project-setup · Next.js 16 · Tailwind CSS v4 · shadcn/ui
          </p>
        </div>

      </div>
    </main>
  )
}