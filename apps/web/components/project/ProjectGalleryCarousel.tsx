'use client'

import { memo, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

import { cn } from '@workspace/ui/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@workspace/ui/components/carousel'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import GalleryLightbox from '@/components/project/GalleryLightbox'

interface ProjectGalleryCarouselProps {
  urls: string[]
  title: string
}

const GallerySlide = memo(function GallerySlide({
  url,
  title,
  idx,
  isActive,
  onClick,
}: {
  url: string
  title: string
  idx: number
  isActive: boolean
  onClick: () => void
}) {
  return (
    <CarouselItem className="basis-[90%] pl-3">
      <button
        type="button"
        onClick={onClick}
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
            !isActive && 'brightness-50'
          )}
        />
      </button>
    </CarouselItem>
  )
})

export default function ProjectGalleryCarousel({
  urls,
  title,
}: ProjectGalleryCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

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

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }, [])

  return (
    <div className="rounded-xl border border-border p-4">
      {urls.length > 1 ? (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            disabled={activeIndex === 0}
            aria-label="이전 슬라이드"
            className="hidden min-h-[44px] min-w-[44px] shrink-0 items-center justify-center text-foreground/50 transition-colors hover:text-foreground disabled:opacity-20 sm:flex"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <Carousel
            setApi={setApi}
            opts={{ align: 'start', loop: false }}
            className="min-w-0 flex-1"
          >
            <CarouselContent className="-ml-3">
              {urls.map((url, idx) => (
                <GallerySlide
                  key={idx}
                  url={url}
                  title={title}
                  idx={idx}
                  isActive={idx === activeIndex}
                  onClick={() => openLightbox(idx)}
                />
              ))}
            </CarouselContent>
          </Carousel>

          <button
            type="button"
            onClick={() => api?.scrollNext()}
            disabled={activeIndex === urls.length - 1}
            aria-label="다음 슬라이드"
            className="hidden min-h-[44px] min-w-[44px] shrink-0 items-center justify-center text-foreground/50 transition-colors hover:text-foreground disabled:opacity-20 sm:flex"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      ) : (
        <Carousel
          setApi={setApi}
          opts={{ align: 'start', loop: false }}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {urls.map((url, idx) => (
              <GallerySlide
                key={idx}
                url={url}
                title={title}
                idx={idx}
                isActive={true}
                onClick={() => openLightbox(idx)}
              />
            ))}
          </CarouselContent>
        </Carousel>
      )}

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

      <GalleryLightbox
        urls={urls}
        title={title}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </div>
  )
}
