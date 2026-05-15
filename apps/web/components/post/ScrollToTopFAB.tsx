'use client'

import { useEffect, useState } from 'react'

import { ArrowUp } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'

// 300px 이상 스크롤 시 노출되는 스크롤 최상단 버튼
export default function ScrollToTopFAB() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <Button
      size="icon"
      variant="outline"
      className="fixed right-6 bottom-6 z-50 rounded-full shadow-lg"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="맨 위로 이동"
    >
      <ArrowUp className="size-4" />
    </Button>
  )
}
