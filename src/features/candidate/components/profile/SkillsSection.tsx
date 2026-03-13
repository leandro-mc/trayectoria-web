'use client'

import { useCandidateSkills, useAddSkills, useDeleteSkill } from '../../hooks/useCandidate'
import { SkillPicker } from '@/features/skills/components/SkillPicker'
import type { SkillResponse } from '../../types/candidate.types'

export function SkillsSection() {
  const { data: skills = [], isLoading } = useCandidateSkills()
  const { mutate: addSkills   } = useAddSkills()
  const { mutate: deleteSkill } = useDeleteSkill()

  function handleAdd(skill: SkillResponse) {
    addSkills({ skillIds: [skill.id] })
  }

  function handleRemove(skillId: number) {
    deleteSkill(skillId)
  }

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-card">
      <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Skills</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Buscá y agregá tus habilidades técnicas y blandas
        </p>
      </div>
      <div className="p-6">
        {isLoading ? (
          <div className="flex flex-wrap gap-2 animate-pulse">
            {[80, 60, 100, 70, 90].map((w) => (
              <div
                key={w}
                className="h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800"
                style={{ width: `${w}px` }}
              />
            ))}
          </div>
        ) : (
          <SkillPicker
            selected={skills}
            onAdd={handleAdd}
            onRemove={handleRemove}
          />
        )}
      </div>
    </div>
  )
}
