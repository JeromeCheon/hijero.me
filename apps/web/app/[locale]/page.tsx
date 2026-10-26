import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { SITE_URL } from '@/lib/config/site'
import { pageAlternates } from '@/lib/seo/alternates'
import { HeroBio } from '@/components/home/HeroBio'
import { HomePostSection } from '@/components/home/HomePostSection'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Meta.home' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: pageAlternates(locale),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${SITE_URL}/${locale}`,
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

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}) {
  const { locale } = await params
  const { category: rawCategory } = await searchParams
  setRequestLocale(locale)

  const category =
    rawCategory === 'tech' || rawCategory === 'life' ? rawCategory : undefined

  return (
    <>
      <HeroBio />
      <HomePostSection locale={locale} category={category} />
    </>
  )
}
