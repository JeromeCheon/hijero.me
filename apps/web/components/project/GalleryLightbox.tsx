'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'

import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryLightboxProps {
  urls: string[]
  title: string
  initialIndex: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function GalleryLightbox({
  urls,
  title,
  initialIndex,
  open,
  onOpenChange,
}: GalleryLightboxProps) {
  const [lightboxIndex, setLightboxIndex] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<{
    x: number
    y: number
    panX: number
    panY: number
  } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // open이 true로 바뀔 때 initialIndex로 sync
  useEffect(() => {
    if (open) setLightboxIndex(initialIndex)
  }, [open, initialIndex])

  const navigateLightbox = useCallback(
    (dir: -1 | 1) => {
      const next = lightboxIndex + dir
      if (next < 0 || next >= urls.length) return
      setLightboxIndex(next)
      setZoom(1)
      setPanOffset({ x: 0, y: 0 })
    },
    [lightboxIndex, urls.length]
  )

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next)
    if (!next) {
      setZoom(1)
      setPanOffset({ x: 0, y: 0 })
    }
  }

  // 키보드 좌우 탐색
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigateLightbox(-1)
      if (e.key === 'ArrowRight') navigateLightbox(1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, navigateLightbox])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return
    e.preventDefault()
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: panOffset.x,
      panY: panOffset.y,
    }
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    const el = containerRef.current
    const maxX = el ? (el.clientWidth * (zoom - 1)) / 2 : 300
    const maxY = el ? (el.clientHeight * (zoom - 1)) / 2 : 200
    setPanOffset({
      x: Math.max(-maxX, Math.min(maxX, dragStartRef.current.panX + dx)),
      y: Math.max(-maxY, Math.min(maxY, dragStartRef.current.panY + dy)),
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    dragStartRef.current = null
  }

  const handleDoubleClick = () => {
    const newZoom = zoom === 1 ? 2 : 1
    setZoom(newZoom)
    if (newZoom === 1) setPanOffset({ x: 0, y: 0 })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[90vw] max-w-[90vw] border-none bg-black/90 p-0 shadow-none sm:max-w-[90vw]"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">{title} 갤러리 이미지</DialogTitle>

        {urls.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => navigateLightbox(-1)}
              disabled={lightboxIndex === 0}
              aria-label="이전 이미지"
              className="absolute top-1/2 left-2 z-10 -translate-y-1/2 text-white/60 transition-colors hover:text-white disabled:opacity-20"
            >
              <ChevronLeft className="h-10 w-6" />
            </button>
            <button
              type="button"
              onClick={() => navigateLightbox(1)}
              disabled={lightboxIndex === urls.length - 1}
              aria-label="다음 이미지"
              className="absolute top-1/2 right-2 z-10 -translate-y-1/2 text-white/60 transition-colors hover:text-white disabled:opacity-20"
            >
              <ChevronRight className="h-10 w-6" />
            </button>
          </>
        )}

        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(1, z - 0.5))}
            disabled={zoom <= 1}
            aria-label="축소"
            className="rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80 disabled:opacity-40"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2, z + 0.5))}
            disabled={zoom >= 2}
            aria-label="확대"
            className="rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80 disabled:opacity-40"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <DialogClose
            aria-label="닫기"
            className="rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
          >
            <X className="h-4 w-4" />
          </DialogClose>
        </div>

        {urls[lightboxIndex] && (
          <div
            ref={containerRef}
            className="relative w-full overflow-hidden"
            style={{ height: 'min(calc(90vw * 9 / 16), 85vh)' }}
          >
            <div
              className="absolute inset-0 transition-transform duration-300 select-none"
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
                cursor: isDragging ? 'grabbing' : zoom > 1 ? 'grab' : 'zoom-in',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onDoubleClick={handleDoubleClick}
            >
              <Image
                src={urls[lightboxIndex]}
                alt={`${title} 확대 이미지`}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
