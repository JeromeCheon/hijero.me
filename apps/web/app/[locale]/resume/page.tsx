export const revalidate = 1800

import { setRequestLocale } from 'next-intl/server'

import { HeroBio } from '@/components/home/HeroBio'
import { ProfileSection } from '@/components/resume/ProfileSection'
import { ProjectsSection } from '@/components/resume/ProjectsSection'
import { SkillsSection } from '@/components/resume/SkillsSection'
import { WorkExperienceSection } from '@/components/resume/WorkExperienceSection'

export default async function ResumePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="space-y-6">
      <HeroBio showActions={false} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <ProfileSection />
          <SkillsSection />
        </div>
        <div className="space-y-4">
          <WorkExperienceSection />
          <ProjectsSection />
        </div>
      </div>
    </div>
  )
}
