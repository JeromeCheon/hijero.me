import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts/getAllPosts'

const locales = ['ko', 'en']
const staticRoutes = ['', '/tech', '/life', '/resume']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hijero-me.vercel.app'
  const now = new Date()

  const staticEntries = locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${siteUrl}/${locale}${route}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  )

  const postEntries = (
    await Promise.all(
      locales.map(async (locale) => {
        const posts = getAllPosts(locale)
        return posts.map((post) => ({
          url: `${siteUrl}/${locale}/${post.category}/${post.slug}`,
          lastModified: new Date(post.publishedAt),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }))
      })
    )
  ).flat()

  return [...staticEntries, ...postEntries]
}
