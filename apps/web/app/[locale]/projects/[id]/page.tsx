import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { getProjectById, getProjects } from '@/lib/notion/projects'
import { ProjectDetail } from '@/components/project/ProjectDetail'

export const revalidate = 1800

export async function generateStaticParams() {
  try {
    const projects = await getProjects()
    return routing.locales.flatMap((locale) =>
      projects.map((project) => ({ locale, id: project.id }))
    )
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params
  const project = await getProjectById(id, locale)
  if (!project) return {}
  return {
    title: project.name,
    description: project.description,
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const project = await getProjectById(id, locale)
  if (!project) notFound()
  return <ProjectDetail project={project} />
}
