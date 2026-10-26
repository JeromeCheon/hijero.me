import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { SITE_URL } from '@/lib/config/site'
import { pageAlternates } from '@/lib/seo/alternates'

import PostListPage from '@/components/post/PostListPage'

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ tag?: string; sort?: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Meta.life' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: pageAlternates(locale, '/life'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${SITE_URL}/${locale}/life`,
      siteName: 'hijero.me',
      locale,
      type: 'website',
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  }
}

export default async function LifePage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const { tag, sort } = await searchParams

  setRequestLocale(locale)

  return <PostListPage locale={locale} category="life" tag={tag} sort={sort} />
}
