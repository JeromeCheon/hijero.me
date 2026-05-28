import { getTranslations } from 'next-intl/server'

import type { StaticProject } from '@/content/projects'
import Image from 'next/image'
import { Badge } from '@workspace/ui/components/badge'
import { Link } from '@/i18n/navigation'
import ReadingProgressBar from '@/components/post/ReadingProgressBar'
import ScrollToTopFAB from '@/components/post/ScrollToTopFAB'
import {
  ExternalLink,
  Check,
  Globe,
  BookOpen,
  Search,
  Eye,
  Database,
  Zap,
  ScanText,
  UserCheck,
  Activity,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const FEATURE_ICONS: Record<string, LucideIcon> = {
  Globe,
  BookOpen,
  Search,
  Eye,
  Database,
  Zap,
  ScanText,
  UserCheck,
  Activity,
}

interface StaticProjectDetailProps {
  project: StaticProject
  locale: string
}

export async function StaticProjectDetail({
  project,
  locale,
}: StaticProjectDetailProps) {
  const loc = locale as 'ko' | 'en'
  const t = await getTranslations({ locale, namespace: 'Projects' })

  return (
    <>
      <ReadingProgressBar />

      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* 뒤로가기 */}
        <Link
          href="/projects"
          className="mb-8 inline-flex text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span aria-hidden="true">←</span> {t('title')}
        </Link>

        {/* Hero 섹션 */}
        <section className="mt-4 mb-12">
          <h1 className="text-4xl leading-tight font-bold">
            {project.title[loc]}
          </h1>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
            <span>
              {t('period')}: {project.period[loc]}
            </span>
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
              >
                {t('viewDemo')}
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </section>

        {/* Tech Stack */}
        {project.techItems.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold">
              {t('sectionTechStack')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.techItems.map((tech) => (
                <Badge key={tech.name} variant="secondary">
                  {tech.name}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Overview */}
        {project.overview && (
          <section className="mb-10">
            <h2 className="mb-3 text-2xl font-semibold">
              {t('sectionOverview')}
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              {project.overview[loc]}
            </p>
            {project.overviewBullets && project.overviewBullets.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {project.overviewBullets.map((bullet, idx) => (
                  <li
                    key={idx}
                    className="group flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary group-hover:animate-jump-up" />
                    <span>{bullet[loc]}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Problem */}
        {project.problem && (
          <section className="mb-10">
            <h2 className="mb-3 text-2xl font-semibold">
              {t('sectionProblem')}
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              {project.problem[loc]}
            </p>
          </section>
        )}

        {/* Features */}
        {project.features && project.features.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold">
              {t('sectionKeyFeatures')}
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {project.features.map((feature, idx) => {
                const Icon = feature.icon ? FEATURE_ICONS[feature.icon] : null
                return (
                  <li
                    key={idx}
                    className="group rounded-lg border border-border p-4"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      {Icon && (
                        <Icon className="h-4 w-4 text-primary group-hover:animate-icon-shake" />
                      )}
                      <h3 className="font-semibold">{feature.title[loc]}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {feature.description[loc]}
                    </p>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {/* Outcome */}
        {project.outcome && (
          <section className="mb-10">
            <h2 className="mb-3 text-2xl font-semibold">
              {t('sectionOutcome')}
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              {project.outcome[loc]}
            </p>
            {project.outcomeBullets && project.outcomeBullets.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {project.outcomeBullets.map((bullet, idx) => (
                  <li
                    key={idx}
                    className="group flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary group-hover:animate-jump-up" />
                    <span>{bullet[loc]}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Timeline */}
        {project.timeline && project.timeline.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold">
              {t('sectionTimeline')}
            </h2>
            <ol className="relative border-l border-border pl-6">
              {project.timeline.map((item, idx) => (
                <li key={idx} className="mb-6 last:mb-0">
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 animate-dot-flicker rounded-full border border-background bg-primary" />
                  <time className="mb-1 block text-xs font-medium text-muted-foreground">
                    {item.date[loc]}
                  </time>
                  <h3 className="font-semibold">{item.title[loc]}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description[loc]}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Gallery */}
        {project.galleryUrls && project.galleryUrls.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold">
              {t('sectionGallery')}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {project.galleryUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video overflow-hidden rounded-lg bg-muted"
                >
                  <Image
                    src={url}
                    alt={`${project.title[loc]} screenshot ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <ScrollToTopFAB />
    </>
  )
}
