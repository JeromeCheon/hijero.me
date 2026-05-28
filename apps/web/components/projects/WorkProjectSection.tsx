import { getLocale } from 'next-intl/server'

import { getProjects } from '@/lib/notion/projects'
import { getResumeData } from '@/lib/resume'
import { WorkProjectCard } from './WorkProjectCard'

export async function WorkProjectSection() {
  const locale = await getLocale()
  const notionProjects = await getProjects()
  const staticProjects = getResumeData(locale).projects
  const projects = notionProjects.length > 0 ? notionProjects : staticProjects

  if (projects.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {projects.map((project) => (
        <WorkProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
