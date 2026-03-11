'use client'

import { Scale } from 'lucide-react'
import { CarFront, Inspection, Gallery, Key } from '@/components/icons'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'
import { PageTransition } from '@/components/ui/PageTransition'
import { Counter } from '@/components/ui/Counter'
import { Button } from '@/components/ui/Button'

const methodCards = [
  {
    icon: Inspection,
    title: 'Perizia 100+ Controlli',
    description:
      'Ogni auto viene sottoposta a una perizia approfondita con oltre 100 controlli meccanici, elettrici e di carrozzeria.',
  },
  {
    icon: Gallery,
    title: 'Foto Professionali',
    description:
      'Servizio fotografico professionale per presentare ogni veicolo al meglio, con dettagli su interni ed esterni.',
  },
  {
    icon: Key,
    title: 'Documenti Verificati',
    description:
      'Verifichiamo lo storico del veicolo, i tagliandi, i passaggi di proprietà e l\'assenza di gravami o ipoteche.',
  },
  {
    icon: Scale,
    title: 'Tutela Legale',
    description:
      'Ogni compravendita è assistita legalmente per tutelare sia l\'acquirente che il venditore in ogni fase.',
  },
] as const

const stats = [
  { target: 200, suffix: '+', label: 'Auto Vendute' },
  { target: 180, suffix: '+', label: 'Clienti Soddisfatti' },
  { target: 1, suffix: '', label: 'Anno di Esperienza' },
] as const

export function ChiSiamoContent() {
  return (
    <PageTransition>
      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-primary py-16 md:py-24">
        <div className="mx-auto px-4 lg:px-12 2xl:px-20 text-center">
          <AnimateOnScroll variant="fade-up">
            <h1 className="font-heading text-5xl font-bold text-white md:text-6xl">
              Chi Siamo
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
              La tua agenzia di compravendita auto tra privati a Rho, parte del
              network Privacar, leader in Italia.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── About ─────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto px-4 lg:px-12 2xl:px-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Text */}
            <AnimateOnScroll variant="slide-left">
              <div>
                <h2 className="font-heading text-4xl font-bold text-text-primary md:text-5xl">
                  Privacar Rho
                </h2>
                <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
                  <p>
                    <strong className="text-text-primary">Privacar</strong> è il
                    network leader in Italia nella compravendita di auto tra
                    privati. Fondata con la missione di rendere sicuro e
                    trasparente il mercato dell&apos;usato, Privacar offre un
                    servizio unico che tutela sia chi vende che chi acquista.
                  </p>
                  <p>
                    La sede di <strong className="text-text-primary">Rho</strong>{' '}
                    è il punto di riferimento per tutto il territorio del
                    nord-ovest milanese. Situata in Via Madonna 23, la nostra
                    agenzia accoglie clienti da Rho, Lainate, Arese, Bollate,
                    Pregnana Milanese e tutti i comuni limitrofi.
                  </p>
                  <p>
                    Il nostro team di professionisti ti accompagna in ogni fase
                    della compravendita: dalla valutazione alla perizia, dalla
                    pubblicazione dell&apos;annuncio alla gestione delle pratiche
                    burocratiche, fino al passaggio di proprietà.
                  </p>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Placeholder image */}
            <AnimateOnScroll variant="slide-right">
              <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-bg-alt">
                <div className="flex flex-col items-center gap-3 text-text-muted">
                  <CarFront className="h-16 w-16" />
                  <p className="text-sm font-medium">Privacar Rho</p>
                  <p className="text-xs">Via Madonna, 23 — Rho (MI)</p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ─── Il Metodo Privacar ────────────────────────────────────────── */}
      <section className="bg-bg-alt py-16 md:py-24">
        <div className="mx-auto px-4 lg:px-12 2xl:px-20">
          <AnimateOnScroll variant="fade-up">
            <div className="mb-12 text-center">
              <h2 className="font-heading text-4xl font-bold text-text-primary md:text-5xl">
                Il Metodo Privacar
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
                Un processo collaudato per garantire sicurezza e trasparenza in
                ogni compravendita
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {methodCards.map((card, index) => {
              const Icon = card.icon
              return (
                <AnimateOnScroll
                  key={card.title}
                  variant="fade-up"
                  delay={index * 0.1}
                >
                  <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-text-primary">
                      {card.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-text-secondary">
                      {card.description}
                    </p>
                  </div>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Counters ──────────────────────────────────────────────────── */}
      <section className="bg-primary py-16 md:py-24">
        <div className="mx-auto px-4 lg:px-12 2xl:px-20">
          <AnimateOnScroll variant="fade-up">
            <div className="mb-12 text-center">
              <h2 className="font-heading text-4xl font-bold text-white md:text-5xl">
                I Nostri Numeri
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {stats.map((stat, index) => (
              <AnimateOnScroll
                key={stat.label}
                variant="fade-up"
                delay={index * 0.15}
              >
                <div className="flex flex-col items-center text-center">
                  <Counter
                    target={stat.target}
                    suffix={stat.suffix}
                    className="text-5xl font-bold text-white"
                  />
                  <p className="mt-3 text-lg font-medium text-white/70">
                    {stat.label}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto px-4 lg:px-12 2xl:px-20 text-center">
          <AnimateOnScroll variant="fade-up">
            <h2 className="font-heading text-4xl font-bold text-text-primary md:text-5xl">
              Vieni a Trovarci
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-text-secondary">
              Siamo in Via Madonna 23, a Rho (MI). Vieni a trovarci o contattaci
              per fissare un appuntamento.
            </p>
            <div className="mt-8">
              <Button variant="primary" size="lg" href="/contatti">
                Contattaci
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </PageTransition>
  )
}
