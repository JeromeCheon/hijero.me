import { getTranslations } from 'next-intl/server'
import { cn } from '@workspace/ui/lib/utils'
import { getAllPosts } from '@/lib/posts/getAllPosts'
import { Link } from '@/i18n/navigation'
import { PostHomeCard } from './PostHomeCard'

interface HomePostSectionProps {
  locale: string
  category?: 'tech' | 'life'
}

export async function HomePostSection({
  locale,
  category,
}: HomePostSectionProps) {
  const t = await getTranslations('HomeSection')
  const posts = getAllPosts(locale, category).slice(0, 3)

  const tabs = [
    { key: undefined, label: t('tabAll') },
    { key: 'tech' as const, label: t('tabTech') },
    { key: 'life' as const, label: t('tabLife') },
  ]

  return (
    <section className="mt-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{t('recentPosts')}</h2>
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <Link
              key={tab.label}
              href={tab.key ? `/?category=${tab.key}` : '/'}
              className={cn(
                'rounded-full px-3 py-1 text-sm transition-colors',
                category === tab.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostHomeCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {t('noPosts')}
        </p>
      )}

      <div className="mt-4 text-right">
        <Link
          href={category ? `/${category}` : '/tech'}
          className="text-sm text-primary hover:underline"
        >
          {t('readMore')} →
        </Link>
      </div>
    </section>
  )
}
