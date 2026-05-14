import { setRequestLocale } from 'next-intl/server'
import { HeroBio } from '@/components/home/HeroBio'
import { HomePostSection } from '@/components/home/HomePostSection'

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
