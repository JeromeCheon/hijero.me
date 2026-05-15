'use client'

import { useEffect } from 'react'

import { incrementViewCount } from '@/app/actions/incrementViewCount'

interface ViewCountTrackerProps {
  slug: string
}

// 마운트 시 1회 조회수 증가 요청 — 렌더링 없음
export default function ViewCountTracker({ slug }: ViewCountTrackerProps) {
  useEffect(() => {
    incrementViewCount(slug)
  }, [slug])

  return null
}
