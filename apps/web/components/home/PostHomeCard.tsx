import { Link } from '@/i18n/navigation'
import type { Post } from '@/lib/posts/types'
import { cn } from '@workspace/ui/lib/utils'
import { useTranslations } from 'next-intl'

interface PostHomeCardProps {
  post: Post
}

export function PostHomeCard({ post }: PostHomeCardProps) {
  const t = useTranslations('PostList')
  const formattedDate = post.publishedAt.slice(0, 10)

  return (
    <Link
      href={`/${post.category}/${post.slug}`}
      className="group flex flex-col rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
    >
      <div className="mb-2 flex items-center gap-3">
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
            post.category === 'tech'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
              : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
          )}
        >
          {post.category}
        </span>
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
        <span className="text-xs text-muted-foreground">
          {t('readingTime', { minutes: post.readingTime })}
        </span>
      </div>
      <h3 className="mb-1 text-lg leading-snug font-bold group-hover:text-primary">
        {post.title}
      </h3>

      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
        {post.description}
      </p>
    </Link>
  )
}
