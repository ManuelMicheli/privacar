'use client'

import { useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

const animationVariants: Record<string, Variants> = {
  'fade-up': {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
  'fade-in': {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  'slide-left': {
    hidden: { x: -40, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
  'slide-right': {
    hidden: { x: 40, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
}

export type AnimateOnScrollVariant =
  | 'fade-up'
  | 'fade-in'
  | 'slide-left'
  | 'slide-right'

export interface AnimateOnScrollProps {
  children: React.ReactNode
  variant?: AnimateOnScrollVariant
  delay?: number
  className?: string
}

export function AnimateOnScroll({
  children,
  variant = 'fade-up',
  delay = 0,
  className,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      variants={animationVariants[variant]}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}
