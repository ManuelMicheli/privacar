'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Search, Phone, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const navLinks = [
  { label: 'Parco Auto', href: '/auto' },
  { label: 'Servizi', href: '/servizi' },
  { label: 'Vendi la tua Auto', href: '/vendi' },
  { label: 'Chi Siamo', href: '/chi-siamo' },
  { label: 'Contatti', href: '/contatti' },
] as const

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
} as const

const panelVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: '100%',
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
    },
  },
} as const

const linkContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
} as const

const linkVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25 },
  },
} as const

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="mobile-backdrop"
            className="fixed inset-0 z-50 bg-black/50"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="mobile-panel"
            className="fixed right-0 top-0 z-50 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-2xl"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Menu di navigazione"
          >
            {/* Header with close button */}
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <Link href="/" onClick={onClose} className="flex items-center">
                <Image
                  src="/images/privacar_logo.svg"
                  alt="Privacar Rho"
                  width={140}
                  height={36}
                  className="h-8 w-auto"
                />
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-primary/5 hover:text-primary"
                aria-label="Chiudi menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <motion.nav
              className="flex-1 overflow-y-auto px-4 py-2"
              variants={linkContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <ul>
                {navLinks.map((link) => (
                  <motion.li key={link.href} variants={linkVariants}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={cn(
                        'block border-b border-border py-4 text-lg transition-colors',
                        isActive(link.href)
                          ? 'font-semibold text-primary'
                          : 'text-text-primary hover:text-primary'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>

            {/* Bottom section */}
            <div className="border-t border-border p-4">
              {/* CTA Button */}
              <Link
                href="/auto"
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-primary-light"
              >
                <Search className="h-5 w-5" />
                Cerca Auto
              </Link>

              {/* Contact Info */}
              <div className="mt-4 flex items-center justify-center gap-4">
                <a
                  href="tel:+3902930987"
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-primary/5 hover:text-primary"
                  aria-label="Chiama Privacar Rho"
                >
                  <Phone className="h-4 w-4" />
                  <span>Chiamaci</span>
                </a>
                <a
                  href="https://wa.me/3902930987"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-whatsapp transition-colors hover:bg-whatsapp/5"
                  aria-label="Contattaci su WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
