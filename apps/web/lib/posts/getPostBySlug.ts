// Server Component에서만 import할 것
import { getAllPosts } from './getAllPosts'
import type { Post } from './types'

export function getPostBySlug(locale: string, slug: string): Post | null {
  const posts = getAllPosts(locale)
  return posts.find((p) => p.slug === slug) ?? null
}
