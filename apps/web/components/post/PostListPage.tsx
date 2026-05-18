import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import { getAllPosts } from '@/lib/posts/getAllPosts'
import { PostListItem } from '@/components/post/PostListItem'
import { cn } from '@workspace/ui/lib/utils'

interface PostListPageProps {
  locale: string
  category: 'tech' | 'life'
  tag?: string
  sort?: string
}

export default function PostListPage({
  locale,
  category,
  tag,
  sort,
}: PostListPageProps) {
  const t = useTranslations('PostList')

  const allPosts = getAllPosts(locale, category)

  // 유니크 태그 추출
  const allTags = Array.from(new Set(allPosts.flatMap((p) => p.tags))).sort()

  // 태그 필터링
  const filteredPosts = tag
    ? allPosts.filter((p) => p.tags.includes(tag))
    : allPosts

  // 정렬
  // sort=popular: 현재 Supabase 미연결 상태이므로 최신순 fallback
  // TODO: Supabase 조회수 데이터 연동 후 인기순 정렬 구현
  const sortedPosts =
    sort === 'popular'
      ? [...filteredPosts].sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        )
      : filteredPosts

  const activeTag = tag ?? null
  const activeSort = sort === 'popular' ? 'popular' : 'latest'
  const titleKey = category === 'tech' ? 'techTitle' : 'lifeTitle'
  const pathname = `/${category}`

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="flex flex-row justify-between gap-2">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="mb-1 text-3xl font-bold">{t(titleKey)}</h1>
          <p className="text-sm text-muted-foreground">
            {t('postCount', { count: filteredPosts.length })}
          </p>
        </div>
        {/* 정렬 버튼 */}
        <div>
          <div className="flex gap-1">
            <Link
              href={{
                pathname,
                query: { ...(tag ? { tag } : {}), sort: 'latest' },
              }}
              className={cn(
                'rounded-md px-3 py-1 text-sm transition-colors',
                activeSort === 'latest'
                  ? 'bg-foreground font-medium text-background'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('sortLatest')}
            </Link>
            <Link
              href={{
                pathname,
                query: { ...(tag ? { tag } : {}), sort: 'popular' },
              }}
              className={cn(
                'rounded-md px-3 py-1 text-sm transition-colors',
                activeSort === 'popular'
                  ? 'bg-foreground font-medium text-background'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('sortPopular')}
            </Link>
          </div>
        </div>
      </div>
      {/* 태그 필터 */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Link
            href={{ pathname, query: sort ? { sort } : {} }}
            className={cn(
              'rounded-full px-3 py-1 text-sm font-medium transition-colors',
              activeTag === null
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:bg-muted/70'
            )}
          >
            #{t('allTag')}
          </Link>
          {allTags.map((tagItem) => (
            <Link
              key={tagItem}
              href={{
                pathname,
                query: { tag: tagItem, ...(sort ? { sort } : {}) },
              }}
              className={cn(
                'rounded-full px-3 py-1 text-sm font-medium transition-colors',
                activeTag === tagItem
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70'
              )}
            >
              #{tagItem}
            </Link>
          ))}
        </div>
      </div>

      {/* 포스트 목록 */}
      {sortedPosts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {sortedPosts.map((post) => (
            <PostListItem key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-muted-foreground">
          {tag ? t('emptyTagged') : t('empty')}
        </p>
      )}
    </div>
  )
}
