import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import PostListPage from '@/components/post/PostListPage'

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ tag?: string; sort?: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Meta.tech' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hijero.me'
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${siteUrl}/${locale}/tech`,
      siteName: 'hijero.me',
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  }
}

export default async function TechPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const { tag, sort } = await searchParams

  setRequestLocale(locale)

  return <PostListPage locale={locale} category="tech" tag={tag} sort={sort} />
}
