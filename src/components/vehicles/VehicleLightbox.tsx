'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { VehicleImage } from '@/types'

export interface VehicleLightboxProps {
  images: VehicleImage[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
}

export function VehicleLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
}: VehicleLightboxProps) {
  const [activeIndex, setActiveIndex] = useState(currentIndex)

  // Sync activeIndex when lightbox opens or currentIndex changes
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(currentIndex)
    }
  }, [isOpen, currentIndex])

  const goTo = useCallback(
    (index: number) => {
      const total = images.length
      setActiveIndex(((index % total) + total) % total)
    },
    [images.length]
  )

  const goPrev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex])
  const goNext = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          goPrev()
          break
        case 'ArrowRight':
          goNext()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, goPrev, goNext])

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      const threshold = 50
      const velocityThreshold = 500

      if (
        info.offset.x < -threshold ||
        info.velocity.x < -velocityThreshold
      ) {
        goNext()
      } else if (
        info.offset.x > threshold ||
        info.velocity.x > velocityThreshold
      ) {
        goPrev()
      }
    },
    [goNext, goPrev]
  )

  if (images.length === 0) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Counter */}
          <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-lg bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-lg bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Chiudi galleria"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Previous button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Immagine precedente"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Next button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={goNext}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Immagine successiva"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Main image with swipe support */}
          <motion.div
            key={activeIndex}
            className="relative mx-auto h-full max-h-[80vh] w-full max-w-5xl cursor-grab px-16 active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src={images[activeIndex].url}
              alt={`Immagine ${activeIndex + 1} di ${images.length}`}
              fill
              sizes="100vw"
              className="pointer-events-none select-none object-contain"
              priority
            />
          </motion.div>

          {/* Click outside image to close */}
          <div
            className="absolute inset-0 -z-10"
            onClick={onClose}
            aria-hidden="true"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
