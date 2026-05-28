'use client'

import { useEffect, useState } from 'react'
import { usePathname } from '@/i18n/navigation'

function isNavigationLink(link: HTMLAnchorElement): boolean {
  const href = link.getAttribute('href')
  if (!href) return false
  if (href.startsWith('#')) return false
  if (href.startsWith('mailto:') || href.startsWith('tel:')) return false
  if (link.target === '_blank') return false
  if (href.startsWith('http') && link.host !== window.location.host)
    return false
  return true
}

export function PageTransitionLoader() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const link = (e.target as Element).closest('a')
      if (!link || !isNavigationLink(link as HTMLAnchorElement)) return
      setIsLoading(true)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  useEffect(() => {
    setIsLoading(false)
  }, [pathname])

  if (!isLoading) return null

  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes bounce-drive {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes speed-line {
          0%   { transform: translateX(0px);   opacity: 0.7; }
          100% { transform: translateX(-18px); opacity: 0; }
        }
      `}</style>

      <div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-background/70 backdrop-blur-sm"
        aria-live="polite"
        aria-label="페이지 로딩 중"
      >
        <div className="relative flex h-28 w-52 items-center justify-center">
          {/* 자동차 SVG */}
          <svg
            viewBox="0 0 160 75"
            width="160"
            height="75"
            className="text-primary"
            style={{ animation: 'bounce-drive 0.45s ease-in-out infinite' }}
          >
            {/* 속도선 3개 */}
            <line
              x1="15"
              y1="35"
              x2="40"
              y2="35"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.5"
              style={{ animation: 'speed-line 0.4s ease-out infinite' }}
            />
            <line
              x1="10"
              y1="44"
              x2="30"
              y2="44"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.35"
              style={{ animation: 'speed-line 0.4s ease-out 0.13s infinite' }}
            />
            <line
              x1="18"
              y1="27"
              x2="32"
              y2="27"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.25"
              style={{ animation: 'speed-line 0.4s ease-out 0.07s infinite' }}
            />

            {/* 차체 하단 */}
            <rect
              x="30"
              y="32"
              width="118"
              height="26"
              rx="7"
              fill="currentColor"
            />
            {/* 차체 루프 */}
            <path d="M52 32 L68 12 L110 12 L128 32Z" fill="currentColor" />
            {/* 앞유리 */}
            <path
              d="M70 30 L72 14 L108 14 L125 30Z"
              fill="white"
              opacity="0.2"
            />
            {/* 앞바퀴 */}
            <circle cx="58" cy="60" r="13" fill="currentColor" />
            <circle
              cx="58"
              cy="60"
              r="5"
              fill="white"
              opacity="0.6"
              style={{
                transformOrigin: '58px 60px',
                animation: 'spin 0.35s linear infinite',
              }}
            />
            {/* 뒷바퀴 */}
            <circle cx="120" cy="60" r="13" fill="currentColor" />
            <circle
              cx="120"
              cy="60"
              r="5"
              fill="white"
              opacity="0.6"
              style={{
                transformOrigin: '120px 60px',
                animation: 'spin 0.35s linear infinite',
              }}
            />
            {/* 헤드라이트 */}
            <rect
              x="143"
              y="38"
              width="7"
              height="5"
              rx="2"
              fill="white"
              opacity="0.7"
            />
          </svg>
        </div>
      </div>
    </>
  )
}
