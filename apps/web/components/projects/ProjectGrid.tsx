import type { StaticProject } from '@/content/projects'
import { ProjectCard } from './ProjectCard'

interface ProjectGridProps {
  projects: StaticProject[]
  emptyMessage?: string
  showSoloBadge?: boolean
}

export function ProjectGrid({
  projects,
  emptyMessage,
  showSoloBadge,
}: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="flex min-h-48 items-center justify-center text-muted-foreground">
        {emptyMessage ?? 'No projects'}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.slug}
          project={project}
          showSoloBadge={showSoloBadge}
        />
      ))}
    </div>
  )
}
