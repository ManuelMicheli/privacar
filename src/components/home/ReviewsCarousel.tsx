'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

interface Review {
  id: number
  text: string
  name: string
  source: string
  rating: number
}

const reviews: Review[] = [
  {
    id: 1,
    text: "Esperienza fantastica! Ho venduto la mia auto in meno di 2 settimane. Personale gentilissimo e processo trasparente dall'inizio alla fine. Consigliatissimi!",
    name: 'Marco R.',
    source: 'Google',
    rating: 5,
  },
  {
    id: 2,
    text: 'Professionalita e trasparenza. Ho acquistato una Golf e sono rimasto colpito dalla cura con cui era stata preparata. Tutti i documenti in ordine, nessuna sorpresa.',
    name: 'Laura B.',
    source: 'Google',
    rating: 5,
  },
  {
    id: 3,
    text: 'Ottimo servizio di finanziamento. Mi hanno trovato la rata perfetta per le mie esigenze in pochissimo tempo. Auto in condizioni eccellenti, come da descrizione.',
    name: 'Giuseppe M.',
    source: 'Google',
    rating: 5,
  },
  {
    id: 4,
    text: 'Consiglio Privacar a tutti. Ho acquistato un SUV per la famiglia e il servizio e stato impeccabile. Dalla visita allo showroom alla consegna, tutto perfetto.',
    name: 'Alessia T.',
    source: 'Google',
    rating: 5,
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} stelle su 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            'h-4 w-4',
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
          )}
        />
      ))}
    </div>
  )
}

export function ReviewsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [cardWidth, setCardWidth] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    function updateDimensions() {
      if (containerRef.current) {
        const cw = containerRef.current.offsetWidth
        setContainerWidth(cw)
        if (cw < 640) {
          setCardWidth(cw - 32)
        } else if (cw < 1024) {
          setCardWidth((cw - 48) / 2)
        } else {
          setCardWidth((cw - 64) / 3)
        }
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const gap = 24
  const totalWidth = reviews.length * (cardWidth + gap) - gap
  const maxDrag = Math.max(0, totalWidth - containerWidth)

  function handleDotClick(index: number) {
    setActiveIndex(index)
  }

  const visibleCards = containerWidth < 640 ? 1 : containerWidth < 1024 ? 2 : 3
  const dotCount = Math.max(1, reviews.length - visibleCards + 1)

  return (
    <section className="py-16 md:py-24 bg-bg-alt">
      <div className="mx-auto px-4 sm:px-6 lg:px-12 2xl:px-20">
        {/* Header */}
        <div className="mb-12 text-center">
          <ScrollReveal variant="fadeUp">
            <p className="section-label">RECENSIONI</p>
          </ScrollReveal>
          <ScrollReveal variant="clipUp" delay={0.05}>
            <h2 className="section-title">
              Cosa dicono i nostri clienti
            </h2>
          </ScrollReveal>
        </div>

        {/* Carousel */}
        <ScrollReveal variant="fadeUp" delay={0.15}>
          <div
            ref={containerRef}
            className="overflow-hidden"
          >
            <motion.div
              className="flex cursor-grab active:cursor-grabbing"
              style={{ gap: `${gap}px` }}
              drag="x"
              dragConstraints={{
                left: -maxDrag,
                right: 0,
              }}
              dragElastic={0.1}
              animate={{
                x: -(activeIndex * (cardWidth + gap)),
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onDragEnd={(_, info) => {
                const threshold = cardWidth / 3
                if (info.offset.x < -threshold && activeIndex < dotCount - 1) {
                  setActiveIndex((prev) => prev + 1)
                } else if (info.offset.x > threshold && activeIndex > 0) {
                  setActiveIndex((prev) => prev - 1)
                }
              }}
            >
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  className="shrink-0 rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/50"
                  style={{ width: cardWidth > 0 ? cardWidth : '100%' }}
                >
                  <StarRating rating={review.rating} />

                  <blockquote className="mt-4 font-body text-[15px] leading-relaxed text-text-secondary">
                    &ldquo;{review.text}&rdquo;
                  </blockquote>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-heading font-semibold text-text-primary">
                      {review.name}
                    </p>
                    <span className="text-xs text-text-muted">
                      {review.source}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: dotCount }, (_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={cn(
                'h-2.5 rounded-full transition-all duration-300',
                i === activeIndex
                  ? 'w-8 bg-primary'
                  : 'w-2.5 bg-gray-300 hover:bg-gray-400'
              )}
              aria-label={`Vai alla recensione ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
