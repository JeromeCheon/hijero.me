import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'

import { Link } from '@/i18n/navigation'
import type { StaticProject } from '@/content/projects'
import { cn } from '@workspace/ui/lib/utils'
import { Badge } from '@workspace/ui/components/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { ExternalLink } from 'lucide-react'

interface ProjectCardProps {
  project: StaticProject
  showSoloBadge?: boolean
}

export function ProjectCard({
  project,
  showSoloBadge = false,
}: ProjectCardProps) {
  const t = useTranslations('Projects')
  const locale = useLocale() as 'ko' | 'en'

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
      {/* 썸네일 */}
      <div className="relative h-48 w-full bg-muted">
        {project.thumbnailUrl ? (
          <Image
            src={project.thumbnailUrl}
            alt={project.title[locale]}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <span className="text-4xl font-bold text-primary/30">
              {project.title[locale].charAt(0)}
            </span>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="h-[3rem] overflow-hidden">
          <h3 className="line-clamp-2 text-lg leading-tight font-semibold">
            {project.title[locale]}
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {t('period')}: {project.period[locale]}
          </p>
          {showSoloBadge && (
            <Badge
              variant="outline"
              className="h-4 border-amber-300 bg-amber-100 px-1.5 text-[10px] text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            >
              {t('soloProject')}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="h-[4.5rem] overflow-hidden">
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {project.description[locale]}
          </p>
        </div>

        {/* 기술 칩 */}
        <div className="overflow-x-hidden">
          <div className="flex flex-nowrap gap-1">
            {project.techItems.slice(0, 3).map((tech) => (
              <Badge
                key={tech.name}
                variant="secondary"
                className="shrink-0 text-xs"
              >
                {tech.name}
              </Badge>
            ))}
            {project.techItems.length > 3 && (
              <Badge variant="outline" className="shrink-0 text-xs">
                +{project.techItems.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        {/* 상세 보기 버튼 */}
        <Link
          href={`/projects/${project.slug}`}
          className={cn(
            'inline-flex h-9 flex-1 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground'
          )}
        >
          {t('viewDetail')}
        </Link>

        {/* View Demo 버튼 */}
        {project.demoUrl ? (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 flex-1 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t('viewDemo')}
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        ) : (
          <Button variant="outline" size="sm" className="flex-1" disabled>
            {t('viewDemo')}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
