import { getLocale } from 'next-intl/server'

import { getProjects } from '@/lib/notion/projects'
import { getResumeData } from '@/lib/resume'
import { WorkProjectCard } from './WorkProjectCard'

export async function WorkProjectSection() {
  const locale = await getLocale()
  const staticProjects = getResumeData(locale).projects

  let notionProjects: Awaited<ReturnType<typeof getProjects>> = []
  try {
    notionProjects = await getProjects()
  } catch (err) {
    console.error(
      '[WorkProjectSection] Notion fetch failed, using static fallback',
      err
    )
  }

  const usingNotionData = notionProjects.length > 0
  const projects = usingNotionData ? notionProjects : staticProjects

  if (projects.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {projects.map((project) => (
        <WorkProjectCard
          key={project.id}
          project={project}
          showLink={usingNotionData}
        />
      ))}
    </div>
  )
}
