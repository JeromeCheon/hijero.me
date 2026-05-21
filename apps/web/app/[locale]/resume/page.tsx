import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { HeroBio } from '@/components/home/HeroBio'
import { ProfileSection } from '@/components/resume/ProfileSection'
import { ProjectsSection } from '@/components/resume/ProjectsSection'
import { SkillsSection } from '@/components/resume/SkillsSection'
import { WorkExperienceSection } from '@/components/resume/WorkExperienceSection'

export const revalidate = 1800

type ResumePageProps = { params: Promise<{ locale: string }> }

export async function generateMetadata({
  params,
}: ResumePageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Meta.resume' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hijero.me'
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${siteUrl}/${locale}/resume`,
      siteName: 'hijero.me',
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  }
}

export default async function ResumePage({ params }: ResumePageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="space-y-6">
      <HeroBio showActions={false} showFullBio />
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
