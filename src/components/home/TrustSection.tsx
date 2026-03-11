'use client'

import { Shield, Tag, CreditCard, CheckCircle } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const trustItems = [
  {
    Icon: Shield,
    title: 'Controlli Qualità',
    description: 'Ispezione rigorosa su ogni vettura prima della vendita.',
  },
  {
    Icon: Tag,
    title: 'Prezzo Trasparente',
    description: 'Nessuna sorpresa: il prezzo che vedi è quello reale.',
  },
  {
    Icon: CreditCard,
    title: 'Finanziamento su Misura',
    description: 'Rate personalizzate con approvazione rapida.',
  },
  {
    Icon: CheckCircle,
    title: 'Garanzia Inclusa',
    description: 'Garanzia meccanica inclusa su ogni vettura.',
  },
]

function RotatingCircleCard({
  Icon,
  title,
  description,
  index,
}: {
  Icon: typeof Shield
  title: string
  description: string
  index: number
}) {
  const size = 220
  const strokeWidth = 2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  // Each card gets a slightly different dash pattern for visual variety
  const dashPatterns = [
    { dash: 12, gap: 8 },
    { dash: 18, gap: 6 },
    { dash: 8, gap: 12 },
    { dash: 24, gap: 4 },
  ]
  const pattern = dashPatterns[index % dashPatterns.length]

  return (
    <div className="group flex flex-col items-center gap-5">
      {/* Circular card */}
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Rotating SVG ring */}
        <svg
          className="absolute inset-0"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ animation: `spin-ring ${18 + index * 4}s linear infinite${index % 2 === 1 ? ' reverse' : ''}` }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#ring-gradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${pattern.dash} ${pattern.gap}`}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#065F46" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#047857" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#065F46" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Second rotating ring (outer, subtler) */}
        <svg
          className="absolute inset-0"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ animation: `spin-ring ${24 + index * 3}s linear infinite${index % 2 === 0 ? ' reverse' : ''}` }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius - 6}
            fill="none"
            stroke="#065F46"
            strokeWidth={1}
            strokeDasharray={`${circumference * 0.15} ${circumference * 0.85}`}
            strokeLinecap="round"
            opacity={0.15}
          />
        </svg>

        {/* Static inner content */}
        <div className="relative z-10 flex flex-col items-center justify-center rounded-full bg-white w-[190px] h-[190px] text-center transition-transform duration-500 group-hover:scale-[1.04]"
          style={{ boxShadow: '0 2px 24px rgba(6,95,70,0.06), 0 0 0 1px rgba(6,95,70,0.04)' }}
        >
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/[0.07] transition-colors duration-300 group-hover:bg-primary/[0.12]">
            <Icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
          </div>
          <h3 className="font-heading text-sm font-bold leading-tight text-text-primary px-4">
            {title}
          </h3>
        </div>
      </div>

      {/* Description below the circle */}
      <p className="max-w-[200px] text-center text-sm leading-relaxed text-text-secondary">
        {description}
      </p>
    </div>
  )
}

export function TrustSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <style jsx>{`
        @keyframes spin-ring {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 text-center">
          <ScrollReveal variant="fadeUp">
            <p className="section-label">PERCHÉ SCEGLIERCI</p>
          </ScrollReveal>
          <ScrollReveal variant="clipUp" delay={0.05}>
            <h2 className="section-title">
              Perché Scegliere Privacar
            </h2>
          </ScrollReveal>
        </div>

        {/* Circular cards grid */}
        <div className="grid grid-cols-2 gap-8 sm:gap-12 lg:grid-cols-4 lg:gap-8">
          {trustItems.map((item, i) => (
            <ScrollReveal key={item.title} variant="fadeUp" delay={0.08 * i}>
              <RotatingCircleCard
                Icon={item.Icon}
                title={item.title}
                description={item.description}
                index={i}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
