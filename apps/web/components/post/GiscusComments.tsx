'use client'

import Giscus from '@giscus/react'
import { useLocale } from 'next-intl'
import { useTheme } from 'next-themes'

import { useMounted } from '@/hooks/useMounted'

// Giscus GitHub Discussions 댓글 컴포넌트
// 환경변수 미설정 시 렌더링 스킵 (빌드 실패 방지)
export default function GiscusComments() {
  const { resolvedTheme } = useTheme()
  const locale = useLocale()
  const mounted = useMounted()

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID

  // 마운트 전 및 환경변수 미설정 시 렌더링 스킵 (테마 하이드레이션 불일치 방지)
  if (!mounted || !repo || !repoId || !category || !categoryId) return null

  return (
    <div className="mt-12">
      <Giscus
        repo={repo as `${string}/${string}`}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        lang={locale}
        loading="lazy"
      />
    </div>
  )
}
