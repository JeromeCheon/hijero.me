import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { getProjectById, getProjects } from '@/lib/notion/projects'
import { ProjectDetail } from '@/components/project/ProjectDetail'

export const revalidate = 1800

const locales = ['ko', 'en']

export async function generateStaticParams() {
  try {
    const projects = await getProjects()
    return locales.flatMap((locale) =>
      projects.map((project) => ({ locale, id: project.id }))
    )
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const project = await getProjectById(id)
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
  const { id } = await params
  const project = await getProjectById(id)
  if (!project) notFound()
  return <ProjectDetail project={project} />
}
