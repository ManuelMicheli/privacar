'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatDate } from '@/lib/utils/formatters'
import { updateAppointmentStatus } from '@/lib/actions/appointment-actions'
import type { Appointment, AppointmentStatus } from '@/types'
import toast from 'react-hot-toast'

interface AppointmentsListProps {
  appointments: Appointment[]
}

type TabFilter = 'tutti' | AppointmentStatus

const tabs: { value: TabFilter; label: string }[] = [
  { value: 'tutti', label: 'Tutti' },
  { value: 'pending', label: 'In Attesa' },
  { value: 'confirmed', label: 'Confermati' },
  { value: 'completed', label: 'Completati' },
  { value: 'cancelled', label: 'Annullati' },
]

const statusLabels: Record<AppointmentStatus, string> = {
  pending: 'In Attesa',
  confirmed: 'Confermato',
  completed: 'Completato',
  cancelled: 'Annullato',
}

const statusBadgeColors: Record<AppointmentStatus, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
}

const timeLabels: Record<string, string> = {
  mattina: 'Mattina (9:00 - 12:30)',
  pomeriggio: 'Pomeriggio (15:00 - 19:00)',
}

export function AppointmentsList({
  appointments: initialAppointments,
}: AppointmentsListProps) {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [activeTab, setActiveTab] = useState<TabFilter>('tutti')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered =
    activeTab === 'tutti'
      ? appointments
      : appointments.filter((a) => a.status === activeTab)

  function handleStatusChange(id: string, newStatus: AppointmentStatus) {
    startTransition(async () => {
      const result = await updateAppointmentStatus(id, newStatus)
      if (result.success) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, status: newStatus } : a
          )
        )
        toast.success(`Stato aggiornato: ${statusLabels[newStatus]}`)
      } else {
        toast.error(result.error ?? 'Errore nell\'aggiornamento')
      }
    })
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div>
      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-1 rounded-lg border border-border bg-white p-1">
        {tabs.map((tab) => {
          const count =
            tab.value === 'tutti'
              ? appointments.length
              : appointments.filter((a) => a.status === tab.value).length

          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                activeTab === tab.value
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:bg-gray-100'
              )}
            >
              {tab.label}
              <span
                className={cn(
                  'inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium',
                  activeTab === tab.value
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-text-muted'
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-white py-12 text-center text-sm text-text-muted">
            Nessun appuntamento trovato
          </div>
        ) : (
          filtered.map((appointment) => {
            const isExpanded = expandedId === appointment.id
            const vehicleData = appointment.vehicle as
              | { brand: string; model: string; slug: string }
              | null
              | undefined

            return (
              <div
                key={appointment.id}
                className="rounded-xl border border-border bg-white transition-shadow"
              >
                {/* Row header (clickable) */}
                <button
                  type="button"
                  onClick={() => toggleExpand(appointment.id)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left"
                >
                  {/* Date + time */}
                  <div className="flex shrink-0 items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-text-muted" />
                      <span className="text-sm font-medium text-text-primary">
                        {formatDate(appointment.preferred_date)}
                      </span>
                    </div>
                    <div className="hidden items-center gap-1.5 sm:flex">
                      <Clock className="h-4 w-4 text-text-muted" />
                      <span className="text-xs text-text-secondary">
                        {appointment.preferred_time === 'mattina'
                          ? 'Mattina'
                          : 'Pomeriggio'}
                      </span>
                    </div>
                  </div>

                  {/* Name + vehicle */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 shrink-0 text-text-muted" />
                      <span className="truncate text-sm text-text-primary">
                        {appointment.name}
                      </span>
                    </div>
                    {vehicleData && (
                      <p className="mt-0.5 truncate pl-6 text-xs text-text-muted">
                        {vehicleData.brand} {vehicleData.model}
                      </p>
                    )}
                  </div>

                  {/* Status badge */}
                  <span
                    className={cn(
                      'shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium',
                      statusBadgeColors[appointment.status]
                    )}
                  >
                    {statusLabels[appointment.status]}
                  </span>

                  {/* Expand icon */}
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-text-muted" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-text-muted" />
                  )}
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-border px-5 py-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <span className="text-xs font-medium uppercase text-text-muted">
                          Nome
                        </span>
                        <p className="text-sm text-text-primary">
                          {appointment.name}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-medium uppercase text-text-muted">
                          Email
                        </span>
                        <p className="text-sm text-text-primary">
                          {appointment.email}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-medium uppercase text-text-muted">
                          Telefono
                        </span>
                        <p className="text-sm text-text-primary">
                          {appointment.phone}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-medium uppercase text-text-muted">
                          Data e Orario
                        </span>
                        <p className="text-sm text-text-primary">
                          {formatDate(appointment.preferred_date)} —{' '}
                          {timeLabels[appointment.preferred_time] ??
                            appointment.preferred_time}
                        </p>
                      </div>
                      {vehicleData && (
                        <div>
                          <span className="text-xs font-medium uppercase text-text-muted">
                            Veicolo
                          </span>
                          <p className="text-sm">
                            <Link
                              href={`/auto/${vehicleData.slug}`}
                              target="_blank"
                              className="inline-flex items-center gap-1 text-primary hover:text-primary-light"
                            >
                              {vehicleData.brand} {vehicleData.model}
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </p>
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-medium uppercase text-text-muted">
                          Ricevuto il
                        </span>
                        <p className="text-sm text-text-primary">
                          {formatDate(appointment.created_at)}
                        </p>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mt-4">
                        <span className="text-xs font-medium uppercase text-text-muted">
                          Note
                        </span>
                        <p className="mt-1 whitespace-pre-wrap rounded-lg bg-bg-alt p-3 text-sm text-text-primary">
                          {appointment.notes}
                        </p>
                      </div>
                    )}

                    {/* Status change + contact actions */}
                    <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                      <span className="text-sm font-medium text-text-secondary">
                        Stato:
                      </span>

                      {(
                        ['pending', 'confirmed', 'completed', 'cancelled'] as const
                      ).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleStatusChange(appointment.id, s)}
                          disabled={
                            appointment.status === s || isPending
                          }
                          className={cn(
                            'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                            appointment.status === s
                              ? cn(statusBadgeColors[s], 'cursor-default font-bold')
                              : 'border-border text-text-secondary hover:bg-gray-50'
                          )}
                        >
                          {statusLabels[s]}
                        </button>
                      ))}

                      <div className="ml-auto flex items-center gap-2">
                        <a
                          href={`mailto:${appointment.email}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-gray-50"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          Email
                        </a>
                        <a
                          href={`tel:${appointment.phone}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-gray-50"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          Chiama
                        </a>
                        <a
                          href={`https://wa.me/${appointment.phone.replace(/[^0-9+]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-whatsapp px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
