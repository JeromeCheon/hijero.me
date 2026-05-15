import { Suspense } from 'react'

import { Eye } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

// ---------------------------------------------------------------------------
// ViewCountInner — async Server Component (streaming 렌더링)
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// ViewCount — Suspense boundary wrapper (export default)
// ---------------------------------------------------------------------------
// TODO(human): Task-021 포스트 상세 페이지에서 아래처럼 헤더 영역에 배치하고 스타일 조정:
//
//   import ViewCount from '@/components/post/ViewCount'
//
//   <ViewCount slug={post.slug} />
//
// ViewCount 내부에 Suspense가 이미 포함돼 있으므로 외부에서 추가 Suspense는 불필요하다.
// 헤더에서 날짜/읽기 시간과 같은 행에 배치할 때 flex gap-3 정렬을 활용할 수 있다.

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
