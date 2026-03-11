'use client'

import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Button } from '@/components/ui/Button'

export function CtaBanner() {
  return (
    <section className="bg-gradient-to-r from-[#064E3B] to-[#065F46] py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-12 2xl:px-20">
        <ScrollReveal variant="fadeUp">
          <div className="text-center">
            <ScrollReveal variant="fadeUp" delay={0}>
              <h2 className="font-heading text-4xl font-bold text-white md:text-5xl">
                Vuoi vendere la tua auto?
              </h2>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.15}>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
                Fallo al miglior prezzo, senza stress. Valutazione gratuita.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.3}>
              <div className="mt-8">
                <Button
                  href="/vendi"
                  variant="primary"
                  size="lg"
                  className="bg-white text-[#065F46] hover:bg-[#ECFDF5] hover:text-[#065F46] font-heading"
                >
                  Valuta la tua auto gratuitamente
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
