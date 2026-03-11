'use client'

import { useState } from 'react'
import {
  CreditCard,
  Clock,
  Percent,
  ThumbsUp,
  Shield,
  Settings,
  Cog,
  Zap,
  Disc3,
  Navigation,
  Snowflake,
} from 'lucide-react'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'
import { PageTransition } from '@/components/ui/PageTransition'
import { Button } from '@/components/ui/Button'
import { ContactModal } from '@/components/forms/ContactModal'
import ServiziBentoGrid, { type BentoItem } from '@/components/ui/ServiziBentoGrid'

const financeItems: BentoItem[] = [
  {
    icon: CreditCard,
    title: 'Nessun anticipo obbligatorio',
    description: 'Finanzia l\'intero importo senza dover versare un anticipo. Accedi all\'auto che desideri subito, senza pensieri iniziali.',
  },
  {
    icon: Clock,
    title: 'Rate personalizzabili',
    description: 'Scegli la durata e l\'importo della rata più adatto a te.',
  },
  {
    icon: Percent,
    title: 'Risposta in 24 ore',
    description: 'Ricevi l\'esito della tua richiesta entro un giorno lavorativo.',
  },
  {
    icon: ThumbsUp,
    title: 'Tutti i tipi di auto',
    description: 'Il finanziamento è disponibile su tutte le auto del nostro parco, dalla citycar al SUV.',
  },
]

const warrantyItems: BentoItem[] = [
  {
    icon: Settings,
    title: 'Motore',
    description: 'Copertura completa del blocco motore, testata, distribuzione e tutti i componenti interni.',
  },
  {
    icon: Cog,
    title: 'Cambio',
    description: 'Cambio manuale e automatico, frizione, sincronizzatori e attuatori.',
  },
  {
    icon: Zap,
    title: 'Elettronica',
    description: 'Centraline, sensori, impianto elettrico e sistemi di gestione motore coperti da garanzia.',
  },
  {
    icon: Disc3,
    title: 'Impianto frenante',
    description: 'Pinze, pompa, servofreno, ABS e tutti i componenti idraulici del sistema frenante.',
  },
  {
    icon: Navigation,
    title: 'Sterzo',
    description: 'Cremagliera, servosterzo elettrico e idraulico, tiranti e giunti.',
  },
  {
    icon: Snowflake,
    title: 'Climatizzatore',
    description: 'Compressore, condensatore, evaporatore e tutto il circuito A/C.',
  },
]

export function ServiziContent() {
  const [financeModalOpen, setFinanceModalOpen] = useState(false)
  const [warrantyModalOpen, setWarrantyModalOpen] = useState(false)

  return (
    <PageTransition>
      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-primary py-16 md:py-20">
        <div className="mx-auto px-4 lg:px-12 2xl:px-20 text-center">
          <AnimateOnScroll variant="fade-up">
            <h1 className="font-heading text-5xl font-bold text-white md:text-6xl">
              I Nostri Servizi
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
              Tutto ciò di cui hai bisogno per comprare o vendere la tua auto in
              sicurezza, con il supporto di professionisti.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Section 1: Finanziamento ──────────────────────────────────── */}
      <section id="finanziamento" className="bg-white py-16 md:py-24">
        <div className="mx-auto px-4 lg:px-12 2xl:px-20">
          <AnimateOnScroll variant="fade-up">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5">
                <CreditCard className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-heading text-4xl font-bold text-text-primary md:text-5xl">
                Finanziamento su Misura
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-text-secondary">
                Con Privacar puoi acquistare la tua prossima auto a rate, grazie
                alla collaborazione con i migliori istituti finanziari. Nessun
                anticipo obbligatorio, rate personalizzabili e una risposta
                rapida: ti aiutiamo a trovare la soluzione di finanziamento
                perfetta per le tue esigenze, sia che tu stia cercando una
                citycar o un SUV.
              </p>
            </div>
          </AnimateOnScroll>

          {/* Bento Grid Finanziamento */}
          <AnimateOnScroll variant="fade-up" delay={0.15}>
            <div className="mt-16">
              <ServiziBentoGrid items={financeItems} />
            </div>
          </AnimateOnScroll>

          {/* CTA */}
          <AnimateOnScroll variant="fade-up" delay={0.3}>
            <div className="mt-12 text-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setFinanceModalOpen(true)}
              >
                Richiedi una simulazione
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Section 2: Garanzia ───────────────────────────────────────── */}
      <section id="garanzia" className="bg-bg-alt py-16 md:py-24">
        <div className="mx-auto px-4 lg:px-12 2xl:px-20">
          <AnimateOnScroll variant="fade-up">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-heading text-4xl font-bold text-text-primary md:text-5xl">
                Garanzia Meccanica
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-text-secondary">
                Ogni auto Privacar viene sottoposta a oltre 100 controlli
                meccanici, elettrici e di carrozzeria. Inoltre, offriamo la
                possibilità di estendere la garanzia meccanica fino a 24 mesi,
                per guidare senza pensieri e con la massima tranquillità.
              </p>
            </div>
          </AnimateOnScroll>

          {/* Bento Grid Garanzia */}
          <AnimateOnScroll variant="fade-up" delay={0.15}>
            <div className="mt-16">
              <ServiziBentoGrid items={warrantyItems} />
            </div>
          </AnimateOnScroll>

          {/* CTA */}
          <AnimateOnScroll variant="fade-up" delay={0.3}>
            <div className="mt-12 text-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setWarrantyModalOpen(true)}
              >
                Scopri la copertura
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Modals ────────────────────────────────────────────────────── */}
      <ContactModal
        isOpen={financeModalOpen}
        onClose={() => setFinanceModalOpen(false)}
        requestType="finanziamento"
      />
      <ContactModal
        isOpen={warrantyModalOpen}
        onClose={() => setWarrantyModalOpen(false)}
        requestType="garanzia"
      />
    </PageTransition>
  )
}
