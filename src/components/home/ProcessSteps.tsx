'use client'

import { Car, Inspection, Gallery, Finance } from '@/components/icons'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'

const steps = [
  {
    icon: Car,
    title: 'Portaci la tua auto',
    description: 'o chiedi una visita a domicilio',
  },
  {
    icon: Inspection,
    title: 'Perizia gratuita',
    description: '100+ controlli di qualità',
  },
  {
    icon: Gallery,
    title: 'Pubblichiamo l\'annuncio',
    description: 'Servizio fotografico professionale',
  },
  {
    icon: Finance,
    title: 'Vendiamo al miglior prezzo',
    description: 'Tu incassi, noi gestiamo tutto',
  },
] as const

export function ProcessSteps() {
  return (
    <section className="bg-bg-alt py-16 md:py-24">
      <div className="mx-auto px-4 lg:px-12 2xl:px-20">
        <AnimateOnScroll variant="fade-up">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-4xl font-bold text-text-primary md:text-5xl">
              Come Funziona
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
              Vendere la tua auto con Privacar è semplice, sicuro e veloce
            </p>
          </div>
        </AnimateOnScroll>

        <div className="relative">
          {/* Connector line — desktop only */}
          <div className="absolute left-0 right-0 top-[3.25rem] hidden h-0.5 bg-border md:block" />

          {/* Connector line — mobile only */}
          <div className="absolute bottom-0 left-[1.75rem] top-0 w-0.5 bg-border md:hidden" />

          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <AnimateOnScroll
                  key={step.title}
                  variant="fade-up"
                  delay={index * 0.15}
                >
                  <div className="flex items-start gap-4 md:flex-col md:items-center md:text-center">
                    {/* Step number & icon */}
                    <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-light text-[10px] font-bold text-white">
                        {index + 1}
                      </span>
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Text */}
                    <div>
                      <h3 className="font-heading text-xl font-bold text-text-primary">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm text-text-secondary">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
