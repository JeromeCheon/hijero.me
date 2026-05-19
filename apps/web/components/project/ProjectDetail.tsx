import { getTranslations } from 'next-intl/server'
import Markdown from 'react-markdown'

import { Link } from '@/i18n/navigation'
import { Badge } from '@workspace/ui/components/badge'
import type { Project } from '@/lib/resume/types'

interface ProjectDetailProps {
  project: Project
}

interface HastElement {
  type: string
  tagName?: string
  children?: HastElement[]
}

function hasImageChild(node: unknown): boolean {
  if (!node || typeof node !== 'object') return false
  const el = node as HastElement
  return (
    Array.isArray(el.children) &&
    el.children.some((c) => c.type === 'element' && c.tagName === 'img')
  )
}

export async function ProjectDetail({ project }: ProjectDetailProps) {
  const t = await getTranslations('Project')

  return (
    <article className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <Link
        href="/resume"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {t('backToResume')}
      </Link>
      <div>
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {project.company} · {project.period}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <Badge key={tech} variant="outline">
            {tech}
          </Badge>
        ))}
      </div>
      <hr />
      <div className="prose prose-sm max-w-none dark:prose-invert">
        {project.markdownContent ? (
          <Markdown
            components={{
              p({ node, children }) {
                return hasImageChild(node) ? (
                  <div className="my-4">{children}</div>
                ) : (
                  <p className="my-4">{children}</p>
                )
              },
              code({ children, className, ...rest }) {
                const match = /language-(\w+)/.exec(className ?? '')
                return match ? (
                  <pre className="overflow-x-auto rounded-lg bg-muted p-4">
                    <code className="font-mono text-sm">{children}</code>
                  </pre>
                ) : (
                  <code {...rest} className={className}>
                    {children}
                  </code>
                )
              },
            }}
          >
            {project.markdownContent}
          </Markdown>
        ) : (
          <p>{project.description}</p>
        )}
      </div>
    </article>
  )
}
