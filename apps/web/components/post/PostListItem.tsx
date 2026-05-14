import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import type { Post } from '@/lib/posts/types'
import { cn } from '@workspace/ui/lib/utils'

interface PostListItemProps {
  post: Post
}

export function PostListItem({ post }: PostListItemProps) {
  const t = useTranslations('PostList')

  const formattedDate = post.publishedAt.slice(0, 10)

  return (
    <Link
      href={`/${post.category}/${post.slug}`}
      className={cn(
        'group block rounded-xl border border-border px-6 py-5 transition-colors',
        'hover:bg-muted/50'
      )}
    >
      {/* 카테고리 배지 + 날짜/읽기 시간 행 */}
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

      {/* 제목 */}
      <h2 className="mb-1 text-lg leading-snug font-bold group-hover:text-primary">
        {post.title}
      </h2>

      {/* 설명 */}
      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
        {post.description}
      </p>

      {/* 태그 목록 */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-muted-foreground transition-colors group-hover:text-foreground/70"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
