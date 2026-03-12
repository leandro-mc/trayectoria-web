// Pure content renderer — no modal wrapper.
// Used by CurriculumViewer (modal) and JobCVPanel (inline in split panel).

import { Sparkles, Briefcase, GraduationCap, Code2, Globe, Star } from 'lucide-react'
import type { CurriculumContent } from '../types/curricula.types'

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon:     React.ComponentType<{ className?: string }>
  title:    string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-brand-500" />
        <h3 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
          {title}
        </h3>
      </div>
      {children}
    </div>
  )
}

interface CurriculumDisplayProps {
  content:       CurriculumContent
  compact?:      boolean   // tighter spacing for split panel (less py)
}

export function CurriculumDisplay({ content, compact = false }: CurriculumDisplayProps) {
  const spacing = compact ? 'space-y-5' : 'space-y-6'

  return (
    <div className={spacing}>

      {/* Highlights */}
      {content.highlights && content.highlights.length > 0 && (
        <div
          className="p-4 rounded-xl border border-ai-200 dark:border-ai-800"
          style={{ background: 'linear-gradient(135deg, rgba(168,85,247,.06), rgba(99,102,241,.06))' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-3.5 h-3.5 text-ai-500" />
            <span className="text-xs font-bold text-ai-600 dark:text-ai-400 uppercase tracking-wide">
              Por qué sos ideal para este puesto
            </span>
          </div>
          <ul className="space-y-1.5">
            {content.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                <span className="text-ai-500 font-bold mt-0.5 shrink-0">·</span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary */}
      {content.summary && (
        <Section icon={Sparkles} title="Resumen profesional">
          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {content.summary}
          </p>
        </Section>
      )}

      {/* Experience */}
      {content.experience.length > 0 && (
        <Section icon={Briefcase} title="Experiencia">
          <div className="space-y-4">
            {content.experience.map((exp, i) => (
              <div key={i} className="pl-4 border-l-2 border-neutral-200 dark:border-neutral-700">
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  {exp.position}
                </p>
                <p className="text-xs font-medium text-brand-600 dark:text-brand-400 mb-0.5">
                  {exp.company}
                </p>
                <p className="text-xs text-neutral-400 mb-2">{exp.period}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Education */}
      {content.education.length > 0 && (
        <Section icon={GraduationCap} title="Educación">
          <div className="space-y-3">
            {content.education.map((edu, i) => (
              <div key={i} className="pl-4 border-l-2 border-neutral-200 dark:border-neutral-700">
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  {edu.degree}
                </p>
                <p className="text-xs text-brand-600 dark:text-brand-400">{edu.institution}</p>
                <p className="text-xs text-neutral-400">{edu.period}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Skills */}
      {content.skills.length > 0 && (
        <Section icon={Code2} title="Skills">
          <div className="flex flex-wrap gap-2">
            {content.skills.map((skill, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400"
              >
                {skill}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Languages */}
      {content.languages.length > 0 && (
        <Section icon={Globe} title="Idiomas">
          <div className="flex flex-wrap gap-3">
            {content.languages.map((lang, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {lang.language}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-xs text-brand-600 dark:text-brand-400">
                  {lang.level}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}
