import { Link } from '@/i18n/navigation'
import { Badge } from '@workspace/ui/components/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@workspace/ui/components/card'
import type { Project } from '@/lib/resume/types'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`} className="group block">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <p className="line-clamp-1 font-medium transition-colors group-hover:text-primary">
            {project.name}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{project.company}</p>
            <span className="text-xs text-muted-foreground">
              {project.period}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {project.description}
          </p>
        </CardContent>
        <CardFooter>
          <div className="flex flex-wrap gap-1">
            {project.tech.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
