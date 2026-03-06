import type { Metadata } from 'next'
import { PageHeader } from '@/components/shared/layout/PageHeader'
import { ProfileHeader } from '@/features/candidate/components/profile/ProfileHeader'
import { ProfileForm } from '@/features/candidate/components/profile/ProfileForm'
import { WorkExperienceSection } from '@/features/candidate/components/profile/WorkExperienceSection'
import { EducationSection } from '@/features/candidate/components/profile/EducationSection'
import { SkillsSection } from '@/features/candidate/components/profile/SkillsSection'
import { LanguagesSection } from '@/features/candidate/components/profile/LanguagesSection'

export const metadata: Metadata = { title: 'Mi Perfil' }

export default function ProfilePage() {
  return (
    <div>
      <PageHeader
        title="Mi Perfil"
        description="Completá tu perfil para mejorar tus chances de ser encontrado"
      />

      {/* Avatar + name header */}
      <ProfileHeader />

      {/* Basic info form */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-card p-6 mb-6">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-5">
          Información personal
        </h3>
        <ProfileForm />
      </div>

      {/* Sections */}
      <div className="space-y-6">
        <WorkExperienceSection />
        <EducationSection />
        <SkillsSection />
        <LanguagesSection />
      </div>
    </div>
  )
}
