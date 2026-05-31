'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { X } from 'lucide-react'

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

  return (
    <>
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
                idx === activeIndex
                  ? 'scale-100 opacity-100'
                  : 'scale-[0.97] opacity-40'
              )}
            >
              {/* 클릭하면 라이트박스로 확대 */}
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
                  className="object-cover"
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* 화살표 — 데스크탑에서만 표시 */}
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>

      {/* 도트 인디케이터 */}
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

      {/* 라이트박스 — ESC는 Radix Dialog가 자동 처리 */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-5xl border-none bg-black/90 p-0 shadow-none"
          aria-describedby={undefined}
        >
          {/* 스크린리더용 숨김 타이틀 — Radix Dialog 접근성 요구사항 */}
          <DialogTitle className="sr-only">{title} 갤러리 이미지</DialogTitle>
          <DialogClose className="absolute top-3 right-3 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none">
            <X className="h-5 w-5 text-white" />
            <span className="sr-only">닫기</span>
          </DialogClose>
          {lightboxUrl && (
            <div className="relative aspect-video w-full">
              <Image
                src={lightboxUrl}
                alt={`${title} 확대 이미지`}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
