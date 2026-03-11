'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Menu, Search } from '@/components/icons'
import { cn } from '@/lib/utils/cn'
import { MobileMenu } from './MobileMenu'

const navLinks = [
  { label: 'Parco Auto', href: '/auto' },
  { label: 'Servizi', href: '/servizi' },
  { label: 'Vendi la tua Auto', href: '/vendi' },
  { label: 'Chi Siamo', href: '/chi-siamo' },
  { label: 'Contatti', href: '/contatti' },
] as const

function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.15)
    y.set((e.clientY - centerY) * 0.15)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 80)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // On homepage: transparent initially, glassmorphism on scroll
  // On other pages: always glassmorphism
  const showGlass = isScrolled || !isHomePage
  const darkText = showGlass

  return (
    <>
      <header
        className={cn(
          'fixed top-0 z-50 w-full transition-all duration-[400ms] ease-out',
          showGlass
            ? 'border-b border-[rgba(6,95,70,0.08)] bg-white/85 shadow-[0_1px_20px_rgba(0,0,0,0.04)] backdrop-blur-xl'
            : 'bg-transparent'
        )}
      >
        <nav
          className={cn(
            'mx-auto flex items-center justify-between transition-all duration-[400ms]',
            showGlass
              ? 'h-16 px-4 lg:px-12 2xl:px-20'
              : 'h-20 px-4 py-6 lg:px-12 2xl:px-20'
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={darkText ? '/images/privacar_logo.svg' : '/images/privacar_logo_white.svg'}
              alt="Privacar Rho"
              width={160}
              height={40}
              className="h-8 w-auto transition-all duration-300 md:h-10"
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'group relative px-3 py-2 font-heading text-[15px] font-medium tracking-[-0.01em] transition-colors',
                    isActive(link.href)
                      ? 'font-semibold text-primary'
                      : darkText
                        ? 'text-text-primary hover:text-primary'
                        : 'text-white/90 hover:text-white'
                  )}
                >
                  {link.label}
                  {/* Animated underline */}
                  <span
                    className={cn(
                      'absolute bottom-0 left-3 right-3 h-[2px] bg-primary transition-transform duration-300 [transition-timing-function:cubic-bezier(0.65,0,0.35,1)]',
                      isActive(link.href)
                        ? 'origin-left scale-x-100'
                        : 'origin-left scale-x-0 group-hover:scale-x-100'
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <MagneticButton className="hidden lg:block">
            <Link
              href="/auto"
              className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-6 py-2.5 text-[15px] font-heading font-semibold text-white transition-all duration-300 hover:bg-primary-light hover:shadow-[0_4px_15px_rgba(6,95,70,0.25)] hover:scale-[1.03]"
            >
              <Search className="h-4 w-4" />
              Cerca Auto
            </Link>
          </MagneticButton>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className={cn(
              'inline-flex items-center justify-center rounded-lg p-2 transition-colors lg:hidden',
              darkText
                ? 'text-primary hover:bg-primary/5'
                : 'text-white hover:bg-white/10'
            )}
            aria-label="Apri menu di navigazione"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  )
}
