'use client'

import { Shield, PriceTag, Finance, CheckCircle } from '@/components/icons'
import { motion } from 'framer-motion'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const trustItems = [
  {
    Icon: Shield,
    title: 'Controlli Qualità',
    description: 'Ogni vettura supera un rigoroso processo di ispezione multi-punto prima di entrare nel nostro showroom.',
    stat: '100+',
    statLabel: 'Punti di controllo',
  },
  {
    Icon: PriceTag,
    title: 'Prezzo Trasparente',
    description: 'Nessuna sorpresa: il prezzo che vedi è quello reale. Trasparenza totale su costi e condizioni.',
    stat: '0',
    statLabel: 'Costi nascosti',
  },
  {
    Icon: Finance,
    title: 'Finanziamento su Misura',
    description: 'Rate personalizzate in base alle tue esigenze con approvazione rapida e condizioni competitive.',
    stat: '48h',
    statLabel: 'Approvazione',
  },
  {
    Icon: CheckCircle,
    title: 'Garanzia Inclusa',
    description: 'Garanzia meccanica inclusa su ogni vettura. Acquista con la massima tranquillità.',
    stat: '24',
    statLabel: 'Mesi di copertura',
  },
]

function RotatingCircleCard({
  Icon,
  title,
  description,
  stat,
  statLabel,
  index,
}: {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  title: string
  description: string
  stat: string
  statLabel: string
  index: number
}) {
  const size = 260
  const center = size / 2
  const strokeWidth = 1.5

  // Outer orbit ring
  const outerR = center - 2
  const outerCircumference = 2 * Math.PI * outerR

  // Inner decorative ring
  const innerR = center - 14
  const innerCircumference = 2 * Math.PI * innerR

  // Accent arc — the bright "comet" segment
  const accentR = center - 8
  const accentCircumference = 2 * Math.PI * accentR

  // Speeds & directions per card
  const speeds = [30, 36, 28, 34]
  const reverseFlags = [false, true, true, false]
  const speed = speeds[index % 4]
  const reverse = reverseFlags[index % 4]

  return (
    <div className="group flex flex-col items-center">
      {/* Circular card container */}
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>

        {/* — Layer 1: Faint full outer ring (static) — */}
        <svg className="absolute inset-0 opacity-[0.08]" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={center} cy={center} r={outerR} fill="none" stroke="#065F46" strokeWidth={0.75} />
        </svg>

        {/* — Layer 2: Dashed orbit ring (rotating) — */}
        <svg
          className="absolute inset-0"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{
            animation: `spin-ring ${speed}s linear infinite${reverse ? ' reverse' : ''}`,
          }}
        >
          <circle
            cx={center}
            cy={center}
            r={outerR}
            fill="none"
            stroke="#065F46"
            strokeWidth={strokeWidth}
            strokeDasharray={`2 14`}
            strokeLinecap="round"
            opacity={0.18}
          />
        </svg>

        {/* — Layer 3: Accent arc "comet" (rotating, gradient fade) — */}
        <svg
          className="absolute inset-0"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{
            animation: `spin-ring ${speed * 0.7}s linear infinite${!reverse ? ' reverse' : ''}`,
          }}
        >
          <defs>
            <linearGradient id={`comet-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#065F46" stopOpacity="0" />
              <stop offset="60%" stopColor="#047857" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#065F46" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <circle
            cx={center}
            cy={center}
            r={accentR}
            fill="none"
            stroke={`url(#comet-${index})`}
            strokeWidth={2}
            strokeDasharray={`${accentCircumference * 0.18} ${accentCircumference * 0.82}`}
            strokeLinecap="round"
          />
        </svg>

        {/* — Layer 4: Inner thin ring (rotating opposite) — */}
        <svg
          className="absolute inset-0"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{
            animation: `spin-ring ${speed * 1.4}s linear infinite${reverse ? '' : ' reverse'}`,
          }}
        >
          <circle
            cx={center}
            cy={center}
            r={innerR}
            fill="none"
            stroke="#065F46"
            strokeWidth={0.75}
            strokeDasharray={`${innerCircumference * 0.06} ${innerCircumference * 0.94}`}
            strokeLinecap="round"
            opacity={0.25}
          />
        </svg>

        {/* — Layer 5: Orbiting dot — */}
        <svg
          className="absolute inset-0"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{
            animation: `spin-ring ${speed * 0.5}s linear infinite${reverse ? ' reverse' : ''}`,
          }}
        >
          <circle cx={center} cy={4} r={2.5} fill="#065F46" opacity={0.35} />
          <circle cx={center} cy={4} r={1.5} fill="#047857" opacity={0.6} />
        </svg>

        {/* — Static inner glass circle — */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center rounded-full text-center"
          style={{
            width: size - 56,
            height: size - 56,
            background: 'radial-gradient(ellipse at 30% 20%, rgba(236,253,245,0.8) 0%, rgba(255,255,255,0.95) 50%, rgba(248,250,249,0.9) 100%)',
            boxShadow: `
              0 0 0 1px rgba(6,95,70,0.06),
              0 1px 3px rgba(6,95,70,0.04),
              0 8px 32px rgba(6,95,70,0.06),
              inset 0 1px 0 rgba(255,255,255,0.8)
            `,
          }}
          whileHover={{ scale: 1.06 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {/* Icon */}
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/[0.08] to-primary/[0.03] transition-all duration-500 group-hover:from-primary/[0.14] group-hover:to-primary/[0.06] group-hover:shadow-[0_0_20px_rgba(6,95,70,0.1)]">
            <Icon className="h-6 w-6 text-primary transition-transform duration-500 group-hover:scale-110" strokeWidth={1.75} />
          </div>

          {/* Title */}
          <h3 className="font-heading text-[15px] font-semibold leading-snug text-text-primary px-5">
            {title}
          </h3>
        </motion.div>

        {/* — Hover glow ring — */}
        <div
          className="absolute inset-3 rounded-full opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(6,95,70,0.04) 60%, transparent 70%)',
          }}
        />
      </div>

      {/* Stat + Description below */}
      <div className="mt-6 flex flex-col items-center gap-1.5">
        <span className="font-heading text-2xl font-bold text-primary tracking-tight">{stat}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">{statLabel}</span>
        <p className="mt-2 max-w-[220px] text-center text-[13px] leading-relaxed text-text-secondary">
          {description}
        </p>
      </div>
    </div>
  )
}

export function TrustSection() {
  return (
    <section className="relative bg-white py-20 md:py-28 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #065F46 0.5px, transparent 0.5px)`,
        backgroundSize: '48px 48px',
      }} />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="mb-20 text-center">
          <ScrollReveal variant="fadeUp">
            <p className="section-label">PERCHÉ SCEGLIERCI</p>
          </ScrollReveal>
          <ScrollReveal variant="clipUp" delay={0.05}>
            <h2 className="section-title">
              Perché Scegliere Privacar
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeUp" delay={0.1}>
            <p className="section-subtitle mx-auto mt-4">
              Quattro pilastri fondamentali per un acquisto senza pensieri.
            </p>
          </ScrollReveal>
        </div>

        {/* Circular cards */}
        <div className="grid grid-cols-2 gap-y-14 gap-x-6 sm:gap-x-12 lg:grid-cols-4 lg:gap-x-16">
          {trustItems.map((item, i) => (
            <ScrollReveal key={item.title} variant="fadeUp" delay={0.1 + 0.08 * i}>
              <RotatingCircleCard
                Icon={item.Icon}
                title={item.title}
                description={item.description}
                stat={item.stat}
                statLabel={item.statLabel}
                index={i}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
