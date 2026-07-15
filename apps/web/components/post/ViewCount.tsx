import { Suspense } from 'react'

import { Eye } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

async function ViewCountInner({ slug }: { slug: string }) {
  const supabase = createClient()

  const { data } = await supabase
    .from('post_views')
    .select('view_count')
    .eq('slug', slug)
    .maybeSingle<{ view_count: number }>()

  const count = data?.view_count ?? 0

  return (
    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
      <Eye className="size-3.5" aria-hidden />
      <span>{count.toLocaleString()}</span>
    </span>
  )
}

export default function ViewCount({ slug }: { slug: string }) {
  return (
    <Suspense
      fallback={
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <Eye className="size-3.5" aria-hidden />
          <span className="h-3.5 w-6 animate-pulse rounded bg-muted" />
        </span>
      }
    >
      <ViewCountInner slug={slug} />
    </Suspense>
  )
}
