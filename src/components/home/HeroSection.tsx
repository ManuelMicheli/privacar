'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronDown } from '@/components/icons'

const ease = [0.25, 0.4, 0.25, 1]
const clipEase = [0.76, 0, 0.24, 1]

interface HeroSectionProps {
  vehicleCount: number
}

export function HeroSection({ vehicleCount: _vehicleCount }: HeroSectionProps) {
  function scrollToNext() {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    })
  }

  return (
    <section className="relative h-screen overflow-hidden flex items-center lg:items-end">
      {/* Background image with fade in */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease }}
      >
        <Image
          src="/images/wmremove-transformed (68).png"
          alt="Auto in primo piano"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={80}
        />
      </motion.div>

      {/* Refined overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]" />

      {/* Content */}
      <div className="relative mx-auto flex w-full flex-col items-start justify-center px-6 py-36 sm:px-10 lg:pb-24 lg:pt-0 lg:px-16">

        {/* Headline */}
        <div className="overflow-hidden">
          <motion.h1
            className="font-heading text-[42px] font-bold leading-[1.05] tracking-[-0.02em] text-white sm:text-[56px] md:text-[68px] lg:text-[80px]"
            initial={{ y: '105%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.65, ease: clipEase, delay: 0.2 }}
          >
            Privacar Rho
          </motion.h1>
        </div>

        {/* Emerald divider */}
        <motion.div
          className="mt-7 flex items-center gap-3"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.35 }}
          style={{ transformOrigin: 'left' }}
        >
          <span className="h-px w-6 bg-gradient-to-r from-transparent to-[#A7F3D0]/80" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#A7F3D0]" />
          <span className="h-px w-6 bg-gradient-to-l from-transparent to-[#A7F3D0]/80" />
        </motion.div>

        {/* Description */}
        <motion.p
          className="mt-5 max-w-lg font-body text-[15px] leading-relaxed text-white/70 sm:text-[16px]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.42 }}
        >
          Compra e vendi tra privati in totale sicurezza.
          <br className="hidden sm:block" />
          Ogni vettura selezionata e garantita.
        </motion.p>

      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-white/70 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        aria-label="Scorri alla prossima sezione"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity }}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </motion.button>
    </section>
  )
}
