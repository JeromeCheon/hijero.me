import { GraduationCap, MapPin, Award } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'

import { GithubIcon, LinkedinIcon } from '@/config/nav'
import { getResumeData } from '@/lib/resume'

export async function ProfileSection() {
  const t = await getTranslations('Resume')
  const locale = await getLocale()
  const { education } = getResumeData(locale)

  return (
    <section className="rounded-2xl border bg-card p-5">
      <h2 className="mb-4 text-sm font-semibold">{t('profile.about')}</h2>
      <div className="space-y-3">
        <a
          href={process.env.NEXT_PUBLIC_GITHUB_URL ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <GithubIcon className="size-4 shrink-0" />
          <span>JeromeCheon</span>
        </a>

        <a
          href={process.env.NEXT_PUBLIC_LINKEDIN_URL ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <LinkedinIcon className="size-4 shrink-0" />
          <span>Jaehong Cheon</span>
        </a>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          <span>Seoul, Republic of Korea</span>
        </div>

        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <GraduationCap className="mt-0.5 size-4 shrink-0" />
          <div>
            <p>{education.school}</p>
            <p className="text-xs">
              {education.major} ({education.period})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Award className="size-4 shrink-0" />
          <span>OPIc IH (ACTFL, 2020)</span>
        </div>
      </div>
    </section>
  )
}
