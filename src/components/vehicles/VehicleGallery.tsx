'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { Car } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { VehicleLightbox } from './VehicleLightbox'
import type { VehicleImage } from '@/types'

export interface VehicleGalleryProps {
  images: VehicleImage[]
  brand: string
  model: string
}

export function VehicleGallery({ images, brand, model }: VehicleGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const thumbnailsRef = useRef<HTMLDivElement>(null)

  const sortedImages = [...images].sort((a, b) => a.position - b.position)
  const currentImage = sortedImages[selectedIndex]

  const handleThumbnailClick = useCallback((index: number) => {
    setSelectedIndex(index)
  }, [])

  const openLightbox = useCallback(() => {
    if (sortedImages.length > 0) {
      setLightboxOpen(true)
    }
  }, [sortedImages.length])

  if (sortedImages.length === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-2xl bg-bg-alt">
        <div className="flex flex-col items-center gap-3 text-text-muted">
          <Car className="h-16 w-16" />
          <p className="text-sm">Nessuna immagine disponibile</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Main Image */}
      <button
        type="button"
        onClick={openLightbox}
        className="relative block w-full cursor-zoom-in overflow-hidden rounded-2xl bg-bg-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={`Apri galleria immagini di ${brand} ${model}`}
      >
        <div className="aspect-[16/10]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={currentImage.url}
                alt={`${brand} ${model} - Immagine ${selectedIndex + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                priority={selectedIndex === 0}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Image counter */}
        <span className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-3 py-1 text-xs font-medium text-white">
          {selectedIndex + 1} / {sortedImages.length}
        </span>
      </button>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div
          ref={thumbnailsRef}
          className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-none"
          role="tablist"
          aria-label="Miniature immagini"
        >
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              role="tab"
              aria-selected={index === selectedIndex}
              aria-label={`Immagine ${index + 1}`}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                'relative h-[60px] w-[80px] flex-shrink-0 overflow-hidden rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                index === selectedIndex
                  ? 'ring-2 ring-primary ring-offset-1'
                  : 'opacity-60 hover:opacity-100'
              )}
            >
              <Image
                src={image.url}
                alt={`${brand} ${model} - Miniatura ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <VehicleLightbox
        images={sortedImages}
        currentIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  )
}
