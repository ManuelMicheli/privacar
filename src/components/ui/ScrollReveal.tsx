'use client'

import { motion, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

const ease = [0.25, 0.4, 0.25, 1]

const variants: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.97 },
    visible: { opacity: 1, scale: 1 },
  },
  clipUp: {
    hidden: { y: '100%' },
    visible: { y: 0 },
  },
}

export type ScrollRevealVariant = keyof typeof variants

interface ScrollRevealProps {
  children: React.ReactNode
  variant?: ScrollRevealVariant
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}

export function ScrollReveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.5,
  className,
  once = true,
}: ScrollRevealProps) {
  if (variant === 'clipUp') {
    return (
      <div className={cn('overflow-hidden', className)}>
        <motion.div
          variants={variants.clipUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay }}
        >
          {children}
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      variants={variants[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.3 }}
      transition={{ duration, ease, delay }}
    >
      {children}
    </motion.div>
  )
}
