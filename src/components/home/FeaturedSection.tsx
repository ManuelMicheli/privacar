'use client'

import Link from 'next/link'
import { ArrowRight } from '@/components/icons'
import { VehicleGrid } from '@/components/vehicles/VehicleGrid'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import type { Vehicle } from '@/types'

interface FeaturedSectionProps {
  vehicles: Vehicle[]
}

export function FeaturedSection({ vehicles }: FeaturedSectionProps) {
  return (
    <section className="bg-white py-16 pt-20 md:py-24 md:pt-28">
      <div className="mx-auto px-4 sm:px-6 lg:px-12 2xl:px-20">
        {/* Header */}
        <div className="mb-12 text-center">
          <ScrollReveal variant="fadeUp" delay={0}>
            <p className="section-label">IL NOSTRO PARCO AUTO</p>
          </ScrollReveal>
          <ScrollReveal variant="clipUp" delay={0.05}>
            <h2 className="section-title">
              Vetture in Evidenza
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeUp" delay={0.1}>
            <p className="section-subtitle mx-auto mt-3">
              Selezionate dal nostro team per qualita e affidabilita
            </p>
          </ScrollReveal>
        </div>

        {/* Vehicle Grid */}
        <VehicleGrid vehicles={vehicles} columns={3} />

        {/* CTA */}
        <ScrollReveal variant="fadeUp" delay={0.5}>
          <div className="mt-12 text-center">
            <Link
              href="/auto"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-primary px-6 py-3 font-heading font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Vedi tutte le auto
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
