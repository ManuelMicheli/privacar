import { cn } from '@/lib/utils/cn'

// ─── Base Skeleton Block ─────────────────────────────────────────────────────

interface SkeletonBaseProps {
  className?: string
}

function SkeletonBlock({ className }: SkeletonBaseProps) {
  return (
    <div
      className={cn('animate-pulse rounded bg-gray-200', className)}
      aria-hidden="true"
    />
  )
}

// ─── SkeletonImage ───────────────────────────────────────────────────────────

export interface SkeletonImageProps {
  aspectRatio?: string
  className?: string
}

export function SkeletonImage({
  aspectRatio = '16/10',
  className,
}: SkeletonImageProps) {
  return (
    <SkeletonBlock
      className={cn('w-full rounded-2xl', className)}
      // Use inline style for arbitrary aspect ratios
      {...({ style: { aspectRatio } } as React.HTMLAttributes<HTMLDivElement>)}
    />
  )
}

// ─── SkeletonText ────────────────────────────────────────────────────────────

export interface SkeletonTextProps {
  lines?: number
  className?: string
}

const lineWidths = ['w-full', 'w-5/6', 'w-4/6', 'w-3/4', 'w-2/3']

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2.5', className)} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <SkeletonBlock
          key={i}
          className={cn('h-4 rounded', lineWidths[i % lineWidths.length])}
        />
      ))}
    </div>
  )
}

// ─── SkeletonCard ────────────────────────────────────────────────────────────

export interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-gray-100 bg-white',
        className
      )}
      aria-hidden="true"
    >
      {/* Image area — 16:10 aspect ratio */}
      <SkeletonImage aspectRatio="16/10" className="rounded-none rounded-t-2xl" />

      {/* Text content */}
      <div className="space-y-3 p-4">
        {/* Title line */}
        <SkeletonBlock className="h-5 w-3/4 rounded" />

        {/* Subtitle / detail lines */}
        <SkeletonBlock className="h-4 w-full rounded" />
        <SkeletonBlock className="h-4 w-5/6 rounded" />

        {/* Badge row */}
        <div className="flex gap-2 pt-1">
          <SkeletonBlock className="h-6 w-16 rounded-full" />
          <SkeletonBlock className="h-6 w-20 rounded-full" />
        </div>

        {/* Price line */}
        <SkeletonBlock className="mt-2 h-6 w-1/3 rounded" />
      </div>
    </div>
  )
}
