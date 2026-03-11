'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin,
  Phone,
  Email,
  Clock,
  Instagram,
  Facebook,
  PrivacarLogo,
} from '@/components/icons'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const quickLinks = [
  { label: 'Parco Auto', href: '/auto' },
  { label: 'Servizi', href: '/servizi' },
  { label: 'Vendi la tua Auto', href: '/vendi' },
  { label: 'Chi Siamo', href: '/chi-siamo' },
  { label: 'Contatti', href: '/contatti' },
] as const

const services = [
  { label: 'Finanziamento', href: '/servizi#finanziamento' },
  { label: 'Garanzia Meccanica', href: '/servizi#garanzia' },
  { label: 'Perizia 100+ Controlli', href: '/servizi#perizia' },
  { label: 'Passaggio di Proprieta', href: '/servizi#passaggio' },
] as const

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#064E3B] text-white">
      {/* Decorative divider */}
      <div className="flex justify-center">
        <div className="h-[1px] w-[60%] bg-gradient-to-r from-transparent via-[#065F46] to-transparent" />
      </div>

      {/* Main Footer */}
      <div className="mx-auto px-4 pt-20 pb-8 lg:px-12 2xl:px-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1: Brand */}
          <ScrollReveal variant="fadeUp" delay={0}>
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="inline-block">
                <Image
                  src="/images/privacar_logo_white.svg"
                  alt="Privacar Rho"
                  width={160}
                  height={40}
                  className="h-9 w-auto"
                />
              </Link>
              <p className="mt-4 max-w-[260px] font-body text-[14px] leading-relaxed text-[#A7F3D0]/70">
                La tua agenzia di compravendita auto tra privati a Rho. Vetture
                selezionate, garantite e finanziabili.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <a
                  href="https://www.instagram.com/privacar_rho/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] text-[#A7F3D0]/60 transition-all duration-300 hover:bg-white/[0.12] hover:text-white hover:scale-105"
                  aria-label="Seguici su Instagram"
                >
                  <Instagram className="h-[18px] w-[18px]" />
                </a>
                <a
                  href="https://www.facebook.com/privacarrho"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] text-[#A7F3D0]/60 transition-all duration-300 hover:bg-white/[0.12] hover:text-white hover:scale-105"
                  aria-label="Seguici su Facebook"
                >
                  <Facebook className="h-[18px] w-[18px]" />
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Column 2: Quick Links */}
          <ScrollReveal variant="fadeUp" delay={0.1}>
            <div>
              <h3 className="mb-5 font-mono text-[13px] font-medium uppercase tracking-[2px] text-white">
                Link Utili
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-body text-[14px] text-[#A7F3D0]/60 transition-all duration-300 hover:text-white hover:translate-x-[3px] inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Column 3: Services */}
          <ScrollReveal variant="fadeUp" delay={0.2}>
            <div>
              <h3 className="mb-5 font-mono text-[13px] font-medium uppercase tracking-[2px] text-white">
                Servizi
              </h3>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service.href}>
                    <Link
                      href={service.href}
                      className="font-body text-[14px] text-[#A7F3D0]/60 transition-all duration-300 hover:text-white hover:translate-x-[3px] inline-block"
                    >
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Column 4: Contact Info */}
          <ScrollReveal variant="fadeUp" delay={0.3}>
            <div>
              <h3 className="mb-5 font-mono text-[13px] font-medium uppercase tracking-[2px] text-white">
                Contatti
              </h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="https://maps.google.com/?q=Via+Madonna+23+20017+Rho+MI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 font-body text-[14px] text-[#A7F3D0]/60 transition-colors duration-300 hover:text-white"
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#A7F3D0]/60" />
                    <span>Via Madonna, 23, 20017 Rho (MI)</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+39029309876"
                    className="flex items-center gap-3 font-body text-[14px] text-[#A7F3D0]/60 transition-colors duration-300 hover:text-white"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-[#A7F3D0]/60" />
                    <span>+39 02 9309876</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:rho@privacar.com"
                    className="flex items-center gap-3 font-body text-[14px] text-[#A7F3D0]/60 transition-colors duration-300 hover:text-white"
                  >
                    <Email className="h-4 w-4 shrink-0 text-[#A7F3D0]/60" />
                    <span>rho@privacar.com</span>
                  </a>
                </li>
                <li>
                  <div className="flex items-start gap-3 font-body text-[14px] text-[#A7F3D0]/60">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#A7F3D0]/60" />
                    <span>
                      Lun-Ven: 9-12:30 / 15-19
                      <br />
                      Sab: 9-12:30
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 mt-12">
        <div className="mx-auto flex flex-col items-center justify-between gap-4 px-4 pt-6 pb-6 sm:flex-row lg:px-12 2xl:px-20">
          <div className="flex items-center gap-2">
            <PrivacarLogo size={20} className="text-[#A7F3D0]/30" />
            <p className="text-[13px] text-[#A7F3D0]/40">
              &copy; {currentYear} Privacar Rho. Tutti i diritti riservati.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="text-[13px] text-[#A7F3D0]/40 transition-colors duration-300 hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/cookie-policy"
              className="text-[13px] text-[#A7F3D0]/40 transition-colors duration-300 hover:text-white"
            >
              Cookie Policy
            </Link>
            <Link
              href="/admin"
              className="text-[13px] text-[#A7F3D0]/20 transition-colors duration-300 hover:text-white"
            >
              Area Riservata
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
