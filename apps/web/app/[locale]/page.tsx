import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { HeroBio } from '@/components/home/HeroBio'
import { HomePostSection } from '@/components/home/HomePostSection'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Meta.home' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hijero.me'
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${siteUrl}/${locale}`,
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
