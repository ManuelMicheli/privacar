'use client'

import { useEffect, useRef } from 'react'
import {
  useMotionValue,
  useTransform,
  animate,
  useInView,
  motion,
} from 'framer-motion'
import { cn } from '@/lib/utils/cn'

const formatter = new Intl.NumberFormat('it-IT')

export interface CounterProps {
  target: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export function Counter({
  target,
  suffix = '',
  prefix = '',
  duration = 2,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (latest) =>
    formatter.format(Math.round(latest))
  )

  useEffect(() => {
    if (!isInView) return

    const controls = animate(motionValue, target, {
      duration,
      ease: 'easeOut',
    })

    return () => controls.stop()
  }, [isInView, motionValue, target, duration])

  return (
    <span
      ref={ref}
      className={cn('text-4xl font-bold tabular-nums', className)}
      aria-label={`${prefix}${formatter.format(target)}${suffix}`}
    >
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  )
}
