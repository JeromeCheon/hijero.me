import { getLocale, getTranslations } from 'next-intl/server'

import { Badge } from '@workspace/ui/components/badge'

import { getResumeData } from '@/lib/resume'

export async function SkillsSection() {
  const t = await getTranslations('Resume')
  const locale = await getLocale()
  const { skillGroups } = getResumeData(locale)

  return (
    <section className="rounded-2xl border bg-card p-5">
      <h2 className="mb-4 text-sm font-semibold">{t('profile.skills')}</h2>
      <div className="space-y-4">
        {skillGroups.map(({ category, items }) => (
          <div key={category}>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              {category}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {items.map((item) => (
                <Badge key={item} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
