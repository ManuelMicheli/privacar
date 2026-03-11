'use client'

import Link from 'next/link'
import { CreditCard, Shield, ArrowRight } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const services = [
  {
    icon: CreditCard,
    title: 'Finanziamento su Misura',
    description:
      'Soluzioni di finanziamento personalizzate per ogni esigenza. Rata comoda, approvazione rapida e condizioni trasparenti. Ti accompagniamo nella scelta migliore per il tuo budget.',
    href: '/servizi',
  },
  {
    icon: Shield,
    title: 'Garanzia Meccanica',
    description:
      'Ogni vettura supera oltre 100 controlli qualita prima della vendita. Garanzia meccanica inclusa su tutti i veicoli per la tua totale tranquillita.',
    href: '/servizi',
  },
]

export function ServicesSection() {
  return (
    <section className="bg-bg-alt py-16 md:py-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-12 2xl:px-20">
        {/* Header */}
        <div className="mb-12 text-center">
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
              Tutto cio che serve per comprare e vendere in sicurezza
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
              <div className="rounded-2xl bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-md">
                <div className="mb-6 inline-flex rounded-2xl bg-primary-50 p-4">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>

                <h3 className="font-heading text-2xl font-bold text-text-primary">
                  {service.title}
                </h3>

                <p className="mt-3 leading-relaxed text-text-secondary">
                  {service.description}
                </p>

                <Link
                  href={service.href}
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-primary underline-offset-4 decoration-primary/30 hover:decoration-primary transition-colors duration-300"
                >
                  Scopri di piu
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
