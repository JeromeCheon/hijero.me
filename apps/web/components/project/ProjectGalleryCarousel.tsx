'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'

import { cn } from '@workspace/ui/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@workspace/ui/components/carousel'
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import { X, ZoomIn, ZoomOut } from 'lucide-react'

interface ProjectGalleryCarouselProps {
  urls: string[]
  title: string
}

export default function ProjectGalleryCarousel({
  urls,
  title,
}: ProjectGalleryCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxUrl, setLightboxUrl] = useState('')
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

  const onSelect = useCallback(() => {
    if (!api) return
    setActiveIndex(api.selectedScrollSnap())
  }, [api])

  useEffect(() => {
    if (!api) return
    onSelect()
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api, onSelect])

  const openLightbox = (url: string) => {
    setLightboxUrl(url)
    setLightboxOpen(true)
  }

  const handleOpenChange = (open: boolean) => {
    setLightboxOpen(open)
    if (!open) {
      setZoom(1)
      setPanOffset({ x: 0, y: 0 })
    }
  }

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
    <div className="rounded-xl border border-border p-4">
      <Carousel
        setApi={setApi}
        opts={{ align: 'start', loop: false }}
        className="w-full"
      >
        <CarouselContent className="-ml-3">
          {urls.map((url, idx) => (
            <CarouselItem
              key={idx}
              className={cn(
                'basis-[85%] pl-3 transition-all duration-300',
                idx === activeIndex ? 'scale-100' : 'scale-[0.97]'
              )}
            >
              <button
                type="button"
                onClick={() => openLightbox(url)}
                className="relative block aspect-video w-full overflow-hidden rounded-lg bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                aria-label={`${title} screenshot ${idx + 1} 확대 보기`}
              >
                <Image
                  src={url}
                  alt={`${title} screenshot ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 85vw, 60vw"
                  loading="eager"
                  className={cn(
                    'object-cover transition-all duration-300',
                    idx !== activeIndex && 'brightness-50'
                  )}
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>

      {urls.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {urls.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => api?.scrollTo(idx)}
              aria-label={`슬라이드 ${idx + 1}로 이동`}
              className={cn(
                'rounded-full transition-all duration-300',
                idx === activeIndex
                  ? 'h-2 w-6 bg-foreground'
                  : 'h-2 w-2 bg-muted-foreground/40'
              )}
            />
          ))}
        </div>
      )}

      <Dialog open={lightboxOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="w-[90vw] max-w-[90vw] border-none bg-black/90 p-0 shadow-none sm:max-w-[90vw]"
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">{title} 갤러리 이미지</DialogTitle>

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

          {lightboxUrl && (
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
                  cursor: isDragging
                    ? 'grabbing'
                    : zoom > 1
                      ? 'grab'
                      : 'zoom-in',
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onDoubleClick={handleDoubleClick}
              >
                <Image
                  src={lightboxUrl}
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
    </div>
  )
}
