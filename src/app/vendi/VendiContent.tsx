'use client'

import { Shield, Gallery, Finance, Handshake, Key, Phone } from '@/components/icons'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'
import { PageTransition } from '@/components/ui/PageTransition'
import { ProcessSteps } from '@/components/home/ProcessSteps'
import { ValuationForm } from '@/components/forms/ValuationForm'

const advantages = [
  {
    icon: Shield,
    title: 'Zero Rischi',
    description: 'Nessun costo nascosto: paghi solo al momento della vendita.',
  },
  {
    icon: Gallery,
    title: 'Foto Professionali',
    description: 'Servizio fotografico professionale per valorizzare la tua auto.',
  },
  {
    icon: Finance,
    title: 'Miglior Prezzo',
    description: 'Analisi di mercato per ottenere il massimo dalla vendita.',
  },
  {
    icon: Handshake,
    title: 'Ampia Visibilità',
    description: 'La tua auto sarà visibile sul nostro sito e su tutti i portali.',
  },
  {
    icon: Key,
    title: 'Pratiche Incluse',
    description: 'Ci occupiamo noi di tutta la documentazione e del passaggio.',
  },
  {
    icon: Phone,
    title: 'Supporto Dedicato',
    description: 'Un consulente dedicato ti segue in ogni fase della vendita.',
  },
] as const

export function VendiContent() {
  return (
    <PageTransition>
      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[50vh] items-center bg-gradient-to-br from-primary to-primary-light py-20">
        <div className="mx-auto px-4 text-center lg:px-12 2xl:px-20">
          <AnimateOnScroll variant="fade-up">
            <h1 className="font-heading text-5xl font-bold text-white md:text-6xl lg:text-7xl">
              Vuoi vendere la tua auto?
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
              Con Privacar vendi in sicurezza, al miglior prezzo e senza
              pensieri. Ci occupiamo di tutto noi: dalla perizia alla vendita.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Process Steps ─────────────────────────────────────────────── */}
      <ProcessSteps />

      {/* ─── Advantages ────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto px-4 lg:px-12 2xl:px-20">
          <AnimateOnScroll variant="fade-up">
            <div className="mb-12 text-center">
              <h2 className="font-heading text-4xl font-bold text-text-primary md:text-5xl">
                Perché Vendere con Privacar
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
                I vantaggi di affidarti a professionisti per la vendita della tua auto
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {advantages.map((adv, index) => {
              const Icon = adv.icon
              return (
                <AnimateOnScroll
                  key={adv.title}
                  variant="fade-up"
                  delay={index * 0.1}
                >
                  <div className="rounded-2xl border border-border bg-white p-6 transition-shadow hover:shadow-md">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-text-primary">
                      {adv.title}
                    </h3>
                    <p className="mt-2 text-sm text-text-secondary">
                      {adv.description}
                    </p>
                  </div>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Valuation Form ────────────────────────────────────────────── */}
      <section className="bg-bg-alt py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-4">
          <AnimateOnScroll variant="fade-up">
            <ValuationForm />
          </AnimateOnScroll>
        </div>
      </section>
    </PageTransition>
  )
}
