import { ReactNode } from 'react'
import { ArrowRight } from '@/components/icons'
import { cn } from '@/lib/utils/cn'

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        'grid w-full auto-rows-[22rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string
  className?: string
  background?: ReactNode
  Icon: React.ComponentType<{ className?: string }>
  description: string
  href?: string
  cta?: string
}) => (
  <div
    className={cn(
      'group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl',
      'bg-white [box-shadow:0_0_0_1px_rgba(6,95,70,.06),0_2px_4px_rgba(6,95,70,.04),0_12px_24px_rgba(6,95,70,.06)]',
      'transform-gpu transition-shadow duration-300 hover:[box-shadow:0_0_0_1px_rgba(6,95,70,.1),0_4px_8px_rgba(6,95,70,.06),0_24px_48px_rgba(6,95,70,.1)]',
      className
    )}
  >
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
      <Icon className="h-12 w-12 origin-left transform-gpu text-primary transition-all duration-300 ease-in-out group-hover:scale-75" />
      <h3 className="font-heading text-xl font-bold text-text-primary">
        {name}
      </h3>
      <p className="max-w-lg text-sm leading-relaxed text-text-secondary">
        {description}
      </p>
    </div>

    {href && cta && (
      <div
        className={cn(
          'pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'
        )}
      >
        <a
          href={href}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
        >
          {cta}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    )}
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-primary/[.02]" />
  </div>
)

export { BentoCard, BentoGrid }
