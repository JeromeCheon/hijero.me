import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { SITE_URL } from '@/lib/config/site'
import { pageAlternates } from '@/lib/seo/alternates'

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
  return {
    title: t('title'),
    description: t('description'),
    alternates: pageAlternates(locale, '/resume'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${SITE_URL}/${locale}/resume`,
      siteName: 'hijero.me',
      locale,
      type: 'website',
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
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
