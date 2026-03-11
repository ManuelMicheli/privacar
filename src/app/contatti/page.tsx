import type { Metadata } from 'next'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'
import { MapEmbed } from '@/components/contatti/MapEmbed'
import { ContactInfoCard } from '@/components/contatti/ContactInfoCard'
import { ContactForm } from '@/components/forms/ContactForm'
import { AppointmentForm } from '@/components/forms/AppointmentForm'

export const metadata: Metadata = {
  title: 'Contatti',
  description:
    'Contatta Privacar Rho: telefono, WhatsApp, email e indirizzo. Prenota un appuntamento o scrivici per informazioni.',
}

export default function ContattiPage() {
  return (
    <>
      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-primary py-16 md:py-20">
        <div className="mx-auto px-4 text-center lg:px-12 2xl:px-20">
          <h1 className="font-heading text-5xl font-bold text-white md:text-6xl">
            Contatti
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Hai domande? Vuoi fissare un appuntamento? Siamo qui per aiutarti.
          </p>
        </div>
      </section>

      {/* ─── Content ───────────────────────────────────────────────────── */}
      <section className="bg-bg-alt py-16 md:py-24">
        <div className="mx-auto px-4 lg:px-12 2xl:px-20">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left column: Map + Contact Info */}
            <div className="space-y-8">
              <AnimateOnScroll variant="slide-left">
                <MapEmbed />
              </AnimateOnScroll>

              <AnimateOnScroll variant="slide-left" delay={0.1}>
                <ContactInfoCard />
              </AnimateOnScroll>
            </div>

            {/* Right column: Contact Form + Appointment Form */}
            <div className="space-y-8">
              <AnimateOnScroll variant="slide-right">
                <ContactForm />
              </AnimateOnScroll>

              <AnimateOnScroll variant="slide-right" delay={0.1}>
                <AppointmentForm />
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
