'use client'

import Link from 'next/link'
import { Finance, Shield, ArrowRight } from '@/components/icons'
import { motion } from 'framer-motion'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const services = [
  {
    icon: Finance,
    title: 'Finanziamento su Misura',
    description:
      'Soluzioni di finanziamento personalizzate per ogni esigenza. Rata comoda, approvazione rapida e condizioni trasparenti. Ti accompagniamo nella scelta migliore per il tuo budget.',
    href: '/servizi',
    stat: '48h',
    statLabel: 'Approvazione',
  },
  {
    icon: Shield,
    title: 'Garanzia Meccanica',
    description:
      'Ogni vettura supera oltre 100 controlli qualità prima della vendita. Garanzia meccanica inclusa su tutti i veicoli per la tua totale tranquillità.',
    href: '/servizi',
    stat: '100+',
    statLabel: 'Controlli',
  },
]

function OrbitingIcon({
  Icon,
  index,
}: {
  Icon: typeof Finance
  index: number
}) {
  const size = 140
  const center = size / 2
  const outerR = center - 2
  const accentR = center - 8
  const accentCircumference = 2 * Math.PI * accentR
  const innerR = center - 14
  const innerCircumference = 2 * Math.PI * innerR

  const speed = index === 0 ? 28 : 34
  const reverse = index === 1

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      {/* Static faint outer ring */}
      <svg className="absolute inset-0 opacity-[0.08]" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={outerR} fill="none" stroke="#065F46" strokeWidth={0.75} />
      </svg>

      {/* Dashed orbit ring */}
      <svg
        className="absolute inset-0"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ animation: `spin-ring ${speed}s linear infinite${reverse ? ' reverse' : ''}` }}
      >
        <circle
          cx={center}
          cy={center}
          r={outerR}
          fill="none"
          stroke="#065F46"
          strokeWidth={1.5}
          strokeDasharray="2 14"
          strokeLinecap="round"
          opacity={0.18}
        />
      </svg>

      {/* Accent arc "comet" */}
      <svg
        className="absolute inset-0"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ animation: `spin-ring ${speed * 0.7}s linear infinite${!reverse ? ' reverse' : ''}` }}
      >
        <defs>
          <linearGradient id={`svc-comet-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
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
          stroke={`url(#svc-comet-${index})`}
          strokeWidth={2}
          strokeDasharray={`${accentCircumference * 0.18} ${accentCircumference * 0.82}`}
          strokeLinecap="round"
        />
      </svg>

      {/* Inner thin ring */}
      <svg
        className="absolute inset-0"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ animation: `spin-ring ${speed * 1.4}s linear infinite${reverse ? '' : ' reverse'}` }}
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

      {/* Orbiting dot */}
      <svg
        className="absolute inset-0"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ animation: `spin-ring ${speed * 0.5}s linear infinite${reverse ? ' reverse' : ''}` }}
      >
        <circle cx={center} cy={3} r={2} fill="#065F46" opacity={0.35} />
        <circle cx={center} cy={3} r={1.2} fill="#047857" opacity={0.6} />
      </svg>

      {/* Static glass center */}
      <div
        className="absolute inset-0 m-auto flex items-center justify-center rounded-full"
        style={{
          width: size - 44,
          height: size - 44,
          background: 'radial-gradient(ellipse at 30% 20%, rgba(236,253,245,0.8) 0%, rgba(255,255,255,0.95) 50%, rgba(248,250,249,0.9) 100%)',
          boxShadow: `
            0 0 0 1px rgba(6,95,70,0.06),
            0 1px 3px rgba(6,95,70,0.04),
            0 8px 24px rgba(6,95,70,0.06),
            inset 0 1px 0 rgba(255,255,255,0.8)
          `,
        }}
      >
        <Icon className="h-7 w-7 text-primary" strokeWidth={1.75} />
      </div>
    </div>
  )
}

export function ServicesSection() {
  return (
    <section className="relative bg-bg-alt py-20 md:py-28 overflow-hidden">
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.012]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #065F46 0.5px, transparent 0.5px)',
        backgroundSize: '48px 48px',
      }} />

      <div className="relative mx-auto px-4 sm:px-6 lg:px-12 2xl:px-20">
        {/* Header */}
        <div className="mb-16 text-center">
          <ScrollReveal variant="fadeUp">
            <p className="section-label">I NOSTRI SERVIZI</p>
          </ScrollReveal>
          <ScrollReveal variant="clipUp" delay={0.05}>
            <h2 className="section-title">
              I Nostri Servizi
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeUp" delay={0.1}>
            <p className="section-subtitle mx-auto mt-3">
              Tutto ciò che serve per comprare e vendere in sicurezza.
            </p>
          </ScrollReveal>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {services.map((service, index) => (
            <ScrollReveal
              key={service.title}
              variant={index === 0 ? 'fadeLeft' : 'fadeRight'}
              delay={0.15}
            >
              <motion.div
                className="group relative rounded-2xl bg-white p-8 md:p-10 overflow-hidden"
                style={{
                  boxShadow: `
                    0 0 0 1px rgba(6,95,70,0.05),
                    0 1px 3px rgba(6,95,70,0.03),
                    0 8px 32px rgba(6,95,70,0.05)
                  `,
                }}
                whileHover={{
                  boxShadow: `
                    0 0 0 1px rgba(6,95,70,0.08),
                    0 4px 12px rgba(6,95,70,0.06),
                    0 24px 48px rgba(6,95,70,0.1)
                  `,
                  y: -4,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              >
                {/* Decorative background glow */}
                <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/[0.02] blur-3xl transition-opacity duration-700 group-hover:opacity-100 opacity-0 pointer-events-none" />

                <div className="relative flex flex-col sm:flex-row sm:items-start gap-6">
                  {/* Orbiting icon */}
                  <OrbitingIcon Icon={service.icon} index={index} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Stat badge */}
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/[0.04] px-3.5 py-1.5">
                      <span className="font-heading text-lg font-bold text-primary leading-none">{service.stat}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-muted">{service.statLabel}</span>
                    </div>

                    <h3 className="font-heading text-2xl font-bold text-text-primary">
                      {service.title}
                    </h3>

                    <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
                      {service.description}
                    </p>

                    <Link
                      href={service.href}
                      className="group/link mt-6 inline-flex items-center gap-2 font-heading text-sm font-semibold text-primary transition-all duration-300 hover:gap-3"
                    >
                      Scopri di più
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
