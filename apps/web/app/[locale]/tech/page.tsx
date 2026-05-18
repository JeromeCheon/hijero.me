import { setRequestLocale } from 'next-intl/server'

import PostListPage from '@/components/post/PostListPage'

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ tag?: string; sort?: string }>
}

export default async function TechPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const { tag, sort } = await searchParams

  setRequestLocale(locale)

  return <PostListPage locale={locale} category="tech" tag={tag} sort={sort} />
}
