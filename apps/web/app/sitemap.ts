import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/config/site'
import { getAllPosts } from '@/lib/posts/getAllPosts'
import { getProjects } from '@/lib/notion/projects'
import { getAllProjects } from '@/content/projects'
import { routing } from '@/i18n/routing'

// Notion 일시 실패로 줄어든 사이트맵이 다음 배포까지 남지 않게 한다
export const revalidate = 1800

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = routing.locales.flatMap((locale) => getAllPosts(locale))

  // 목록 페이지의 변경 시점 = 범위 내 가장 최근 글 (YYYY-MM-DD는 사전순 = 시간순)
  const latest = (category?: string) =>
    posts
      .filter((p) => !category || p.category === category)
      .map((p) => p.publishedAt)
      .sort()
      .at(-1)

  // lastModified는 근거 있는 값이 있을 때만 넣는다
  const entries = (path: string, lastModified?: string) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
    }))

  const staticEntries = [
    ...entries('', latest()),
    ...entries('/tech', latest('tech')),
    ...entries('/life', latest('life')),
    ...entries('/resume'),
    ...entries('/projects'),
  ]

  const postEntries = posts.map((post) => ({
    url: `${SITE_URL}/${post.locale}/${post.category}/${post.slug}`,
    lastModified: new Date(post.publishedAt),
  }))

  // Notion API 실패 시 빈 배열로 안전하게 처리
  const notionProjects = await getProjects().catch(() => [])
  const projectEntries = [
    ...getAllProjects().map((p) => p.slug),
    ...notionProjects.map((p) => p.id),
  ].flatMap((id) => entries(`/projects/${id}`))

  return [...staticEntries, ...postEntries, ...projectEntries]
}
