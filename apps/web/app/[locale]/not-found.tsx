'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function NotFound() {
  const t = useTranslations('NotFound')

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-4xl font-medium">404</h1>
      <p className="font-medium">{t('title')}</p>
      <p className="text-sm text-muted-foreground">{t('description')}</p>
      <Link href="/" className="text-sm underline underline-offset-4">
        {t('backHome')}
      </Link>
    </div>
  )
}
