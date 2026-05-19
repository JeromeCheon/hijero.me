import { getLocale, getTranslations } from 'next-intl/server'

import { Badge } from '@workspace/ui/components/badge'

import { getResumeData } from '@/lib/resume'

export async function ProjectsSection() {
  const t = await getTranslations('Resume')
  const locale = await getLocale()
  const { projects } = getResumeData(locale)

  return (
    <section className="rounded-2xl border bg-card p-5">
      <h2 className="mb-4 text-sm font-semibold">{t('profile.projects')}</h2>
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.name} className="rounded-xl border bg-muted/30 p-4">
            <div className="mb-1 flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium">{project.name}</p>
                <p className="text-xs text-muted-foreground">
                  {project.company}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {project.period}
              </span>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {project.tech.map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
