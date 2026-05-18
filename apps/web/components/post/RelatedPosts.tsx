import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import { getAllPosts } from '@/lib/posts/getAllPosts'
import type { Post } from '@/lib/posts/types'

interface RelatedPostsProps {
  currentPost: Post
  locale: string
}

function scorePost(current: Post, candidate: Post): number {
  const intersection = candidate.tags.filter((t) => current.tags.includes(t))
  return intersection.length
}

export default async function RelatedPosts({
  currentPost,
  locale,
}: RelatedPostsProps) {
  const t = await getTranslations('Post')
  const allPosts = getAllPosts(locale)

  const related = allPosts
    .filter((p) => p.slug !== currentPost.slug)
    .map((p) => ({ post: p, score: scorePost(currentPost, p) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return (
        new Date(b.post.publishedAt).getTime() -
        new Date(a.post.publishedAt).getTime()
      )
    })
    .slice(0, 3)
    .map(({ post }) => post)

  if (related.length === 0) return null

  return (
    <section className="mt-16 border-t border-border pt-8">
      <h2 className="mb-6 text-lg font-semibold">{t('relatedPosts')}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/${post.category}/${post.slug}`}
            className="group rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
          >
            <span
              className={`mb-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                post.category === 'tech'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                  : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
              }`}
            >
              {post.category}
            </span>
            <h3 className="mb-2 text-sm leading-snug font-medium group-hover:underline">
              {post.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <time dateTime={post.publishedAt}>
                {post.publishedAt.slice(0, 10)}
              </time>
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
