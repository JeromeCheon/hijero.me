import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/config/site'
import { getAllPosts } from '@/lib/posts/getAllPosts'
import { getProjects } from '@/lib/notion/projects'
import { routing } from '@/i18n/routing'

const staticRoutes = ['', '/tech', '/life', '/resume']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries = routing.locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${SITE_URL}/${locale}${route}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  )

  const postEntries = (
    await Promise.all(
      routing.locales.map(async (locale) => {
        const posts = getAllPosts(locale)
        return posts.map((post) => ({
          url: `${SITE_URL}/${locale}/${post.category}/${post.slug}`,
          lastModified: new Date(post.publishedAt),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }))
      })
    )
  ).flat()

  // Notion API 실패 시 빈 배열로 안전하게 처리
  const projects = await getProjects().catch(() => [])
  const projectEntries = routing.locales.flatMap((locale) =>
    projects.map((project) => ({
      url: `${SITE_URL}/${locale}/projects/${project.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  return [...staticEntries, ...postEntries, ...projectEntries]
}
