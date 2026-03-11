'use client'

import { CustomizableGrid, type WidgetConfig } from './CustomizableGrid'
import { StatsCards, type DashboardStats } from './StatsCards'
import {
  Plus,
  Car,
  MessageSquare,
  CalendarDays,
  BarChart3,
  Zap,
} from 'lucide-react'
import { formatDate } from '@/lib/utils/formatters'
import type { ContactRequest, Appointment } from '@/types'
import Link from 'next/link'

interface DashboardContentProps {
  stats: DashboardStats
  contacts: ContactRequest[]
  appointments: Appointment[]
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
  confirmed: 'bg-blue-50 text-blue-700 ring-blue-200',
  completed: 'bg-green-50 text-green-700 ring-green-200',
  cancelled: 'bg-red-50 text-red-700 ring-red-200',
}

const statusLabels: Record<string, string> = {
  pending: 'In attesa',
  confirmed: 'Confermato',
  completed: 'Completato',
  cancelled: 'Annullato',
}

export function DashboardContent({
  stats,
  contacts,
  appointments,
}: DashboardContentProps) {
  const widgets: WidgetConfig[] = [
    {
      id: 'quick-actions',
      title: 'Azioni Rapide',
      icon: <Zap className="h-4 w-4" />,
      defaultColSpan: 2,
      content: (
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/veicoli/nuovo"
            className="inline-flex items-center gap-2 rounded-xl bg-[#065F46] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#047857]"
          >
            <Plus className="h-4 w-4" />
            Aggiungi Veicolo
          </Link>
          <Link
            href="/admin/veicoli"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-gray-50"
          >
            <Car className="h-4 w-4" />
            Gestisci Parco Auto
          </Link>
        </div>
      ),
    },
    {
      id: 'stats',
      title: 'Statistiche',
      icon: <BarChart3 className="h-4 w-4" />,
      defaultColSpan: 2,
      content: <StatsCards stats={stats} />,
    },
    {
      id: 'recent-contacts',
      title: 'Ultimi Contatti',
      icon: <MessageSquare className="h-4 w-4 text-rose-500" />,
      defaultColSpan: 1,
      content: (
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-text-primary">
              <MessageSquare className="h-5 w-5 text-rose-500" />
              Ultimi Contatti
            </h2>
            <Link
              href="/admin/contatti"
              className="text-sm font-medium text-primary hover:text-primary-light"
            >
              Vedi tutti
            </Link>
          </div>

          {contacts.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-muted">
              Nessun contatto ricevuto
            </p>
          ) : (
            <div className="space-y-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between rounded-xl border border-gray-50 bg-gray-50/50 px-4 py-3 transition-colors hover:bg-gray-50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-text-primary">
                        {contact.name}
                      </p>
                      {!contact.is_read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-rose-500" />
                      )}
                    </div>
                    <p className="truncate text-xs text-text-muted">
                      {contact.email}
                    </p>
                  </div>
                  <span className="ml-4 shrink-0 text-xs text-text-muted">
                    {formatDate(contact.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'recent-appointments',
      title: 'Prossimi Appuntamenti',
      icon: <CalendarDays className="h-4 w-4 text-blue-500" />,
      defaultColSpan: 1,
      content: (
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-text-primary">
              <CalendarDays className="h-5 w-5 text-blue-500" />
              Prossimi Appuntamenti
            </h2>
            <Link
              href="/admin/appuntamenti"
              className="text-sm font-medium text-primary hover:text-primary-light"
            >
              Vedi tutti
            </Link>
          </div>

          {appointments.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-muted">
              Nessun appuntamento
            </p>
          ) : (
            <div className="space-y-2">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between rounded-xl border border-gray-50 bg-gray-50/50 px-4 py-3 transition-colors hover:bg-gray-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text-primary">
                      {appointment.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {formatDate(appointment.preferred_date)} —{' '}
                      {appointment.preferred_time === 'mattina'
                        ? 'Mattina'
                        : 'Pomeriggio'}
                    </p>
                  </div>
                  <span
                    className={`ml-4 shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${statusColors[appointment.status] ?? 'bg-gray-50 text-gray-700 ring-gray-200'}`}
                  >
                    {statusLabels[appointment.status] ?? appointment.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
  ]

  return (
    <CustomizableGrid
      widgets={widgets}
      storageKey="privacar-dashboard-layout"
      cols={2}
    />
  )
}
