import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'

import { getAllPosts } from '@/lib/posts/getAllPosts'
import { getPostBySlug } from '@/lib/posts/getPostBySlug'
import { extractHeadings } from '@/lib/posts/extractHeadings'
import GiscusComments from '@/components/post/GiscusComments'
import PostBreadcrumb from '@/components/post/PostBreadcrumb'
import ReadingProgressBar from '@/components/post/ReadingProgressBar'
import RelatedPosts from '@/components/post/RelatedPosts'
import ScrollToTopFAB from '@/components/post/ScrollToTopFAB'
import TableOfContents from '@/components/post/TableOfContents'
import ViewCount from '@/components/post/ViewCount'
import ViewCountTracker from '@/components/post/ViewCountTracker'
import { cn } from '@workspace/ui/lib/utils'

// 허용된 카테고리 목록
const VALID_CATEGORIES = ['tech', 'life'] as const
type ValidCategory = (typeof VALID_CATEGORIES)[number]

function isValidCategory(value: string): value is ValidCategory {
  return (VALID_CATEGORIES as readonly string[]).includes(value)
}

interface PageParams {
  locale: string
  category: string
  slug: string
}

// 빌드 시 모든 포스트에 대한 정적 파라미터 생성
export async function generateStaticParams() {
  const koPosts = getAllPosts('ko')
  const enPosts = getAllPosts('en')
  return [...koPosts, ...enPosts].map((p) => ({
    locale: p.locale,
    category: p.category,
    slug: p.slug,
  }))
}

// OG 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getPostBySlug(locale, slug)

  if (!post) {
    return { title: 'Not Found' }
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      tags: post.tags,
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<PageParams>
}) {
  const { locale, category, slug } = await params

  // setRequestLocale 호출 (next-intl 요구사항)
  setRequestLocale(locale)

  // 허용되지 않은 카테고리 처리
  if (!isValidCategory(category)) {
    notFound()
  }

  // 포스트 로드
  const post = getPostBySlug(locale, slug)
  if (!post || post.category !== category) {
    notFound()
  }

  // MDX 동적 임포트
  const { default: MDXContent } = (await import(
    `@/content/posts/${locale}/${slug}.mdx`
  )) as { default: React.ComponentType }

  // 본문에서 헤딩 추출 (TOC용)
  const headings = extractHeadings(post.content)

  const formattedDate = post.publishedAt.slice(0, 10)
  const t = await getTranslations('PostList')
  return (
    <>
      <ReadingProgressBar />
      <ViewCountTracker slug={post.slug} />
      <div className="mx-auto max-w-[1100px] py-8">
        <div className="flex gap-10">
          {/* 메인 콘텐츠 */}
          <div className="min-w-0 flex-1">
            <PostBreadcrumb category={post.category} />
            {/* 포스트 헤더 */}
            <header className="mb-8">
              {/* 카테고리 배지 */}
              <div className="mb-4">
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
              </div>

              {/* 제목 */}
              <h1 className="mb-4 text-3xl leading-tight font-bold lg:text-4xl">
                {post.title}
              </h1>

              {/* 메타 정보: 날짜, 읽기 시간, 조회수 */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <time dateTime={post.publishedAt}>{formattedDate}</time>
                <span aria-hidden>·</span>
                <span>{t('readingTime', { minutes: post.readingTime })}</span>
                <span aria-hidden>·</span>
                <ViewCount slug={post.slug} />
              </div>

              {/* 태그 칩 */}
              {post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* MDX 본문 */}
            <article className="prose prose-neutral dark:prose-invert max-w-none">
              <MDXContent />
            </article>

            <RelatedPosts currentPost={post} locale={locale} />
            <GiscusComments />
          </div>

          {/* TOC — xl 이상에서만 표시 */}
          <TableOfContents headings={headings} />
        </div>
      </div>
      <ScrollToTopFAB />
    </>
  )
}
