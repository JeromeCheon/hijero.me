import { Link } from '@/i18n/navigation'
import { Badge } from '@workspace/ui/components/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@workspace/ui/components/card'
import type { Project } from '@/lib/resume/types'

interface WorkProjectCardProps {
  project: Project
  showLink?: boolean
}

export function WorkProjectCard({
  project,
  showLink = true,
}: WorkProjectCardProps) {
  const card = (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="h-5 overflow-hidden">
          <p className="line-clamp-1 text-sm font-medium transition-colors group-hover:text-primary">
            {project.name}
          </p>
        </div>
        <div className="flex h-4 items-center justify-between overflow-hidden">
          <p className="truncate text-xs text-muted-foreground">
            {project.company}
          </p>
          <span className="shrink-0 text-xs text-muted-foreground">
            {project.period}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-8 overflow-hidden">
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {project.description}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <div className="h-6 overflow-hidden">
          <div className="flex flex-wrap gap-1">
            {project.tech.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  )

  if (!showLink) return <div className="h-full">{card}</div>

  return (
    <Link href={`/projects/${project.id}`} className="group block h-full">
      {card}
    </Link>
  )
}
