'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Car,
  MessageSquare,
  CalendarDays,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { signOut } from '@/lib/supabase/auth'

interface AdminSidebarProps {
  userEmail: string
  unreadContacts?: number
  pendingAppointments?: number
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/veicoli', label: 'Veicoli', icon: Car },
  { href: '/admin/contatti', label: 'Contatti', icon: MessageSquare, badgeKey: 'unreadContacts' as const },
  { href: '/admin/appuntamenti', label: 'Appuntamenti', icon: CalendarDays, badgeKey: 'pendingAppointments' as const },
  { href: '/admin/impostazioni', label: 'Impostazioni', icon: Settings },
]

export function AdminSidebar({ userEmail, unreadContacts = 0, pendingAppointments = 0 }: AdminSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const badges: Record<string, number> = {
    unreadContacts,
    pendingAppointments,
  }

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <Image
          src="/images/privacar_logo_white.svg"
          alt="Privacar"
          width={120}
          height={30}
          className="h-7 w-auto"
          priority
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[2px] text-white/30">
          Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all',
                active
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/60 hover:bg-white/5 hover:text-white/90'
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span className="flex-1">{item.label}</span>
              {badgeCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                  {badgeCount > 99 ? '99+' : badgeCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/10 p-3">
        {/* Vai al sito */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
        >
          <ExternalLink className="h-[18px] w-[18px] shrink-0" />
          Vai al sito
        </Link>

        {/* User & Logout */}
        <div className="mt-2 rounded-xl bg-white/5 p-3">
          <div className="mb-2 flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium text-white/80">
                {userEmail}
              </p>
              <p className="text-[10px] text-white/40">Amministratore</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
          >
            <LogOut className="h-3.5 w-3.5" />
            Disconnetti
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-xl bg-[#064E3B] p-2.5 text-white shadow-lg ring-1 ring-white/10 lg:hidden"
        aria-label="Apri menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] bg-[#0A2E23] lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Sidebar panel */}
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[260px] bg-[#0A2E23] lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 rounded-lg p-1.5 text-white/50 hover:text-white"
                aria-label="Chiudi menu"
              >
                <X className="h-5 w-5" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
