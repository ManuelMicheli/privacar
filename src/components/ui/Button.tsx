'use client'

import { forwardRef } from 'react'
import Link from 'next/link'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const variantStyles = {
  primary:
    'bg-primary text-white hover:bg-primary-light focus-visible:ring-primary',
  secondary:
    'bg-primary-dark text-white hover:bg-primary focus-visible:ring-primary',
  whatsapp:
    'bg-whatsapp text-white hover:brightness-110 focus-visible:ring-whatsapp',
  outline:
    'border-2 border-primary text-primary hover:bg-primary hover:text-white focus-visible:ring-primary',
  ghost:
    'text-primary hover:bg-primary/5 focus-visible:ring-primary',
} as const

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3',
  lg: 'px-8 py-4 text-lg',
} as const

export type ButtonVariant = keyof typeof variantStyles
export type ButtonSize = keyof typeof sizeStyles

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  children: React.ReactNode
  className?: string
  href?: string
}

const MotionLink = motion.create(Link)

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      children,
      className,
      href,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    const classes = cn(
      'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      variantStyles[variant],
      sizeStyles[size],
      isDisabled && 'pointer-events-none opacity-50',
      className
    )

    const motionProps = {
      whileTap: isDisabled ? undefined : { scale: 0.98 },
      whileHover: isDisabled ? undefined : { scale: 1.02 },
    }

    if (href && !isDisabled) {
      return (
        <MotionLink
          href={href}
          className={classes}
          {...motionProps}
        >
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          {children}
        </MotionLink>
      )
    }

    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...motionProps}
        {...props}
      >
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
