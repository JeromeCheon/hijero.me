import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Button } from '@workspace/ui/components/button'

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <HomePageContent />
}

function HomePageContent() {
  const t = useTranslations('HomePage')

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">{t('title')}</h1>
          <p>{t('description')}</p>
          <p>{t('buttonAdded')}</p>
          <Button className="mt-2">{t('button')}</Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          {t('darkModeHint')}
        </div>
      </div>
    </div>
  )
}
