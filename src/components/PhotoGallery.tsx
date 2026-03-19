'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PhotoGalleryProps {
  images: string[]
}

// Explicit bento grid positions for up to 8 images (4-col grid, 3 rows)
// Row 1-2: hero 2×2 (left) + 4 squares (right)
// Row 3:   small + wide (2-col) + small  → fills all 12 cells with 0 gaps
const bentoLayout = [
  'md:col-span-2 md:row-span-2 col-span-2',       // 0: hero — 2×2 top-left
  '',                                                // 1: top-right area
  '',                                                // 2: top-right area
  '',                                                // 3: mid-right area
  '',                                                // 4: mid-right area
  '',                                                // 5: bottom-left
  'md:col-span-2',                                   // 6: bottom-center wide
  '',                                                // 7: bottom-right
]

export default function PhotoGallery({ images }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const openLightbox = (index: number) => {
    setActiveIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
    document.body.style.overflow = ''
  }, [])

  const goNext = useCallback(() => setActiveIndex((i) => (i + 1) % images.length), [images.length])
  const goPrev = useCallback(() => setActiveIndex((i) => (i - 1 + images.length) % images.length), [images.length])

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxOpen, closeLightbox, goNext, goPrev])

  return (
    <>
      {/* Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 auto-rows-[160px] sm:auto-rows-[200px] md:auto-rows-[220px] lg:auto-rows-[260px]">
        {images.map((src, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className={cn(
              'relative overflow-hidden rounded-xl group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
              bentoLayout[index] || ''
            )}
          >
            <Image
              src={src}
              alt={`Sea-Doo Spark - slika ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={index === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white/60 hover:text-white p-2 z-10 rounded-full hover:bg-white/10 transition-colors"
            onClick={closeLightbox}
            aria-label="Zapri"
          >
            <X className="w-7 h-7" />
          </button>

          {/* Previous */}
          <button
            className="absolute left-3 sm:left-6 text-white/60 hover:text-white p-3 z-10 rounded-full hover:bg-white/10 transition-colors"
            onClick={(e) => { e.stopPropagation(); goPrev() }}
            aria-label="Prejšnja"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Image */}
          <div
            className="relative w-[90vw] h-[80vh] max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex]}
              alt={`Sea-Doo Spark - slika ${activeIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Next */}
          <button
            className="absolute right-3 sm:right-6 text-white/60 hover:text-white p-3 z-10 rounded-full hover:bg-white/10 transition-colors"
            onClick={(e) => { e.stopPropagation(); goNext() }}
            aria-label="Naslednja"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium tabular-nums">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
