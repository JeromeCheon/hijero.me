import type { ReactNode } from 'react'

import { getLocale, getTranslations } from 'next-intl/server'

import { getResumeData } from '@/lib/resume'
import type { HighlightItem } from '@/lib/resume/types'

function renderTextWithLinks(text: string): ReactNode {
  const parts: ReactNode[] = []
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-muted-foreground/50 transition-colors hover:decoration-foreground"
      >
        {match[1]}
      </a>
    )
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts.length === 0 ? text : parts
}

function HighlightList({
  items,
  depth = 0,
}: {
  items: HighlightItem[]
  depth?: number
}) {
  const ulClass = depth === 0 ? 'space-y-4' : 'space-y-2 mt-2 ml-4'
  const liClass =
    depth === 0
      ? 'flex items-start gap-1.5 text-xs font-medium'
      : 'flex items-start gap-1.5 text-xs text-muted-foreground'

  return (
    <ul className={ulClass}>
      {items.map((item, index) => (
        <li key={index} className={liClass}>
          {depth === 0 && (
            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-foreground/50" />
          )}
          {depth === 1 && (
            <span className="mt-1.5 size-1 shrink-0 rounded-full border border-muted-foreground/50" />
          )}
          {depth >= 2 && (
            <span className="mt-0.5 shrink-0 text-muted-foreground/60">-</span>
          )}
          <span className="flex-1">
            {renderTextWithLinks(item.text)}
            {item.children && item.children.length > 0 && (
              <HighlightList items={item.children} depth={depth + 1} />
            )}
          </span>
        </li>
      ))}
    </ul>
  )
}

export async function WorkExperienceSection() {
  const t = await getTranslations('Resume')
  const locale = await getLocale()
  const { workExperiences } = getResumeData(locale)

  return (
    <section className="rounded-2xl border bg-card p-5">
      <h2 className="mb-4 text-sm font-semibold">{t('profile.experience')}</h2>
      <div className="space-y-10">
        {workExperiences.map((exp) => (
          <div key={exp.company}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-base font-medium">{exp.company}</p>
                <p className="text-xs text-muted-foreground">{exp.role}</p>
              </div>
              <span className="shrink-0 text-xs">{exp.period}</span>
            </div>
            <div className="mt-3">
              <HighlightList items={exp.highlights} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
