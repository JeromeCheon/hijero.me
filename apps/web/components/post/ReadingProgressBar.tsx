'use client'

import { useEffect, useState } from 'react'

// 포스트 읽기 진행률 바 — 스크롤 위치 기반 0~100% 표시
export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let rafId: number | null = null

    const handleScroll = () => {
      // 이전 rAF 중복 방지
      if (rafId !== null) return

      rafId = requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight
        setProgress(total > 0 ? (window.scrollY / total) * 100 : 0)
        rafId = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div className="fixed top-0 right-0 left-0 z-50 h-[3px] bg-primary/20 lg:left-20">
      <div
        className="h-full bg-primary"
        style={{ width: `${progress}%`, transition: 'none' }}
        aria-hidden
      />
    </div>
  )
}
