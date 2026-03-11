'use client'

import Link from 'next/link'
import {
  Car,
  BookmarkCheck,
  CheckCircle2,
  MessageSquare,
  CalendarDays,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface DashboardStats {
  disponibili: number
  riservate: number
  vendute: number
  unreadContacts: number
  pendingAppointments: number
}

interface StatsCardsProps {
  stats: DashboardStats
}

const cards = [
  {
    key: 'disponibili' as const,
    label: 'Disponibili',
    description: 'Auto in vendita',
    icon: Car,
    href: '/admin/veicoli',
    gradient: 'from-emerald-500 to-emerald-600',
    bgLight: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    key: 'riservate' as const,
    label: 'Riservate',
    description: 'In trattativa',
    icon: BookmarkCheck,
    href: '/admin/veicoli',
    gradient: 'from-amber-500 to-amber-600',
    bgLight: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    key: 'vendute' as const,
    label: 'Vendute',
    description: 'Completate',
    icon: CheckCircle2,
    href: '/admin/veicoli',
    gradient: 'from-gray-400 to-gray-500',
    bgLight: 'bg-gray-50',
    iconColor: 'text-gray-500',
  },
  {
    key: 'unreadContacts' as const,
    label: 'Non letti',
    description: 'Richieste contatto',
    icon: MessageSquare,
    href: '/admin/contatti',
    gradient: 'from-rose-500 to-rose-600',
    bgLight: 'bg-rose-50',
    iconColor: 'text-rose-600',
  },
  {
    key: 'pendingAppointments' as const,
    label: 'In attesa',
    description: 'Appuntamenti',
    icon: CalendarDays,
    href: '/admin/appuntamenti',
    gradient: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
]

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon
        const value = stats[card.key]

        return (
          <Link
            key={card.key}
            href={card.href}
            className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:shadow-lg hover:shadow-gray-200/50"
          >
            {/* Accent line top */}
            <div className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', card.gradient)} />

            <div className="flex items-start justify-between">
              <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', card.bgLight)}>
                <Icon className={cn('h-5 w-5', card.iconColor)} />
              </div>
              <ArrowRight className="h-4 w-4 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-gray-500" />
            </div>

            <p className="mt-4 text-3xl font-bold tracking-tight text-text-primary">
              {value}
            </p>
            <div className="mt-1">
              <p className="text-sm font-semibold text-text-primary">{card.label}</p>
              <p className="text-xs text-text-muted">{card.description}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
