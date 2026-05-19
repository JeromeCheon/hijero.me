import { getLocale, getTranslations } from 'next-intl/server'

import { getResumeData } from '@/lib/resume'
import { getProjects } from '@/lib/notion/projects'

import { ProjectCard } from './ProjectCard'

export async function ProjectsSection() {
  const t = await getTranslations('Resume')
  const locale = await getLocale()

  const notionProjects = await getProjects()
  const staticProjects = getResumeData(locale).projects
  const projects = notionProjects.length > 0 ? notionProjects : staticProjects

  return (
    <section className="rounded-2xl border bg-card p-5">
      <h2 className="mb-4 text-sm font-semibold">{t('profile.projects')}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
