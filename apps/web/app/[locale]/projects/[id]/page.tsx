import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { SITE_URL } from '@/lib/config/site'
import { routing } from '@/i18n/routing'
import { getProjectById, getProjects } from '@/lib/notion/projects'
import { getAllProjects, getProjectBySlug } from '@/content/projects'
import { ProjectDetail } from '@/components/project/ProjectDetail'
import { StaticProjectDetail } from '@/components/project/StaticProjectDetail'

export const revalidate = 1800

export async function generateStaticParams() {
  // 정적 프로젝트 슬러그
  const staticProjects = getAllProjects()
  const staticParams = routing.locales.flatMap((locale) =>
    staticProjects.map((p) => ({ locale, id: p.slug }))
  )

  // Notion 기반 프로젝트 ID
  try {
    const notionProjects = await getProjects()
    const notionParams = routing.locales.flatMap((locale) =>
      notionProjects.map((p) => ({ locale, id: p.id }))
    )
    return [...staticParams, ...notionParams]
  } catch {
    return staticParams
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params

  // 정적 프로젝트 우선 조회
  const staticProject = getProjectBySlug(id)
  if (staticProject) {
    const loc = locale as 'ko' | 'en'
    const title = `${staticProject.title[loc]} | hijero.me`
    const description = staticProject.description[loc]
    const url = `${SITE_URL}/${locale}/projects/${id}`
    return {
      title,
      description,
      alternates: {
        canonical: url,
        languages: {
          ko: `${SITE_URL}/ko/projects/${id}`,
          en: `${SITE_URL}/en/projects/${id}`,
          'x-default': `${SITE_URL}/ko/projects/${id}`,
        },
      },
      openGraph: {
        title,
        description,
        url,
        ...(staticProject.thumbnailUrl
          ? { images: [{ url: staticProject.thumbnailUrl }] }
          : {}),
      },
    }
  }

  // Notion 기반 프로젝트 조회
  const project = await getProjectById(id, locale)
  if (!project) return {}

  return {
    title: project.name,
    description: project.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/projects/${id}`,
      languages: {
        'x-default': `${SITE_URL}/ko/projects/${id}`,
        ...Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}/${l}/projects/${id}`])
        ),
      },
    },
    openGraph: {
      type: 'website',
      title: project.name,
      description: project.description ?? '',
      url: `${SITE_URL}/${locale}/projects/${id}`,
      images: [{ url: `/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.name,
      description: project.description ?? '',
      images: [`/opengraph-image`],
    },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  setRequestLocale(locale)

  // 정적 프로젝트 우선
  const staticProject = getProjectBySlug(id)
  if (staticProject) {
    return <StaticProjectDetail project={staticProject} locale={locale} />
  }

  // Notion 기반 프로젝트
  const project = await getProjectById(id, locale)
  if (!project) notFound()
  return <ProjectDetail project={project} />
}
