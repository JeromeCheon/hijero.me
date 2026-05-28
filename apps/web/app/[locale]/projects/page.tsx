import { Suspense } from 'react'
import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { UserStar, BriefcaseBusiness } from 'lucide-react'

import { SITE_URL } from '@/lib/config/site'
import { getAllProjects } from '@/content/projects'
import { ProjectGrid } from '@/components/projects/ProjectGrid'
import { WorkProjectSection } from '@/components/projects/WorkProjectSection'

const highlightStyle: CSSProperties = {
  background: 'linear-gradient(transparent 55%, var(--section-highlight) 55%)',
}

export const revalidate = 1800

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Projects' })

  return {
    title: `${t('title')} | hijero.me`,
    description: t('description'),
    alternates: {
      canonical: `${SITE_URL}/${locale}/projects`,
      languages: {
        ko: `${SITE_URL}/ko/projects`,
        en: `${SITE_URL}/en/projects`,
        'x-default': `${SITE_URL}/ko/projects`,
      },
    },
    openGraph: {
      title: `${t('title')} | hijero.me`,
      description: t('description'),
      url: `${SITE_URL}/${locale}/projects`,
    },
  }
}

function WorkProjectSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  )
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'Projects' })
  const projects = getAllProjects()

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
      </div>

      <section className="mb-12">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
          <UserStar className="h-5 w-5" />
          <span style={highlightStyle}>{t('personalProjects')}</span>
        </h2>
        <ProjectGrid
          projects={projects}
          emptyMessage={t('noProjects')}
          showSoloBadge
        />
      </section>

      <section>
        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
          <BriefcaseBusiness className="h-5 w-5" />
          <span style={highlightStyle}>{t('workProjects')}</span>
        </h2>
        <Suspense fallback={<WorkProjectSkeleton />}>
          <WorkProjectSection />
        </Suspense>
      </section>
    </main>
  )
}
