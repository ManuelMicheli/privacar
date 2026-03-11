'use client'

import { useState, useMemo, useTransition } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  MessageCircle,
  ExternalLink,
  X,
  List,
  LayoutGrid,
  Sun,
  Sunset,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { updateAppointmentStatus } from '@/lib/actions/appointment-actions'
import type { Appointment, AppointmentStatus } from '@/types'
import toast from 'react-hot-toast'

/* ─── Constants ─────────────────────────────────────────────────────────────── */

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
const MONTHS_IT = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
]

const statusLabels: Record<AppointmentStatus, string> = {
  pending: 'In Attesa',
  confirmed: 'Confermato',
  completed: 'Completato',
  cancelled: 'Annullato',
}

const statusDot: Record<AppointmentStatus, string> = {
  pending: 'bg-yellow-400',
  confirmed: 'bg-blue-500',
  completed: 'bg-emerald-500',
  cancelled: 'bg-red-400',
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

/* ─── Helpers ───────────────────────────────────────────────────────────────── */

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

/** Monday = 0, Sunday = 6 */
function getStartDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

function toDateKey(date: string) {
  // preferred_date is "YYYY-MM-DD"
  return date.slice(0, 10)
}

function formatDateLong(date: Date) {
  return new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/* ─── Component ─────────────────────────────────────────────────────────────── */

interface Props {
  appointments: Appointment[]
}

type ViewMode = 'calendar' | 'list'

export function AppointmentsCalendar({ appointments: initialAppointments }: Props) {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('calendar')
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all')
  const [isPending, startTransition] = useTransition()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Group appointments by date
  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>()
    for (const apt of appointments) {
      const key = toDateKey(apt.preferred_date)
      const existing = map.get(key) ?? []
      existing.push(apt)
      map.set(key, existing)
    }
    return map
  }, [appointments])

  // Filtered for list view
  const filteredAppointments = useMemo(() => {
    let filtered = appointments
    if (statusFilter !== 'all') {
      filtered = filtered.filter((a) => a.status === statusFilter)
    }
    // Sort by date
    return [...filtered].sort(
      (a, b) => new Date(a.preferred_date).getTime() - new Date(b.preferred_date).getTime()
    )
  }, [appointments, statusFilter])

  // Calendar grid
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month)
    const startDay = getStartDayOfWeek(year, month)
    const days: (number | null)[] = []

    // Leading blanks
    for (let i = 0; i < startDay; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) days.push(d)
    // Trailing blanks to complete last week
    while (days.length % 7 !== 0) days.push(null)

    return days
  }, [year, month])

  // Appointments for selected date
  const selectedDateAppointments = useMemo(() => {
    if (!selectedDate) return []
    const key = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    return appointmentsByDate.get(key) ?? []
  }, [selectedDate, appointmentsByDate])

  // Stats for current month
  const monthStats = useMemo(() => {
    const monthAppts = appointments.filter((a) => {
      const d = new Date(a.preferred_date)
      return d.getFullYear() === year && d.getMonth() === month
    })
    return {
      total: monthAppts.length,
      pending: monthAppts.filter((a) => a.status === 'pending').length,
      confirmed: monthAppts.filter((a) => a.status === 'confirmed').length,
      completed: monthAppts.filter((a) => a.status === 'completed').length,
    }
  }, [appointments, year, month])

  function navigateMonth(delta: number) {
    setCurrentDate(new Date(year, month + delta, 1))
    setSelectedDate(null)
    setSelectedAppointment(null)
  }

  function goToToday() {
    const today = new Date()
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelectedDate(today)
    setSelectedAppointment(null)
  }

  function handleDayClick(day: number) {
    const date = new Date(year, month, day)
    setSelectedDate(date)
    setSelectedAppointment(null)
  }

  function handleStatusChange(id: string, newStatus: AppointmentStatus) {
    startTransition(async () => {
      const result = await updateAppointmentStatus(id, newStatus)
      if (result.success) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        )
        if (selectedAppointment?.id === id) {
          setSelectedAppointment((prev) => prev ? { ...prev, status: newStatus } : null)
        }
        toast.success(`Stato aggiornato: ${statusLabels[newStatus]}`)
      } else {
        toast.error(result.error ?? "Errore nell'aggiornamento")
      }
    })
  }

  const today = new Date()

  return (
    <div className="space-y-4">
      {/* ── Header: Month Stats ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Questo mese', value: monthStats.total, color: 'bg-gray-100 text-text-primary' },
          { label: 'In attesa', value: monthStats.pending, color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Confermati', value: monthStats.confirmed, color: 'bg-blue-50 text-blue-700' },
          { label: 'Completati', value: monthStats.completed, color: 'bg-green-50 text-green-700' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={cn('rounded-xl px-4 py-3 text-center', stat.color)}
          >
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs font-medium opacity-70">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Toolbar ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="min-w-[180px] text-center text-lg font-semibold text-text-primary">
            {MONTHS_IT[month]} {year}
          </h2>
          <button
            onClick={() => navigateMonth(1)}
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-gray-50"
          >
            Oggi
          </button>
          <div className="flex rounded-lg border border-border">
            <button
              onClick={() => setViewMode('calendar')}
              className={cn(
                'rounded-l-lg p-2 transition-colors',
                viewMode === 'calendar'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:bg-gray-50'
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'rounded-r-lg p-2 transition-colors',
                viewMode === 'list'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:bg-gray-50'
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* ── Calendar Grid ─────────────────────────────────────────── */}
          <div className="flex-1 rounded-xl border border-border bg-white">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-border">
              {WEEKDAYS.map((day, i) => (
                <div
                  key={day}
                  className={cn(
                    'py-3 text-center text-xs font-semibold uppercase tracking-wider',
                    i >= 5 ? 'text-text-muted' : 'text-text-secondary'
                  )}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                if (day === null) {
                  return <div key={`blank-${idx}`} className="border-b border-r border-border bg-gray-50/50 p-2" style={{ minHeight: 90 }} />
                }

                const dateObj = new Date(year, month, day)
                const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const dayAppointments = appointmentsByDate.get(dateKey) ?? []
                const isToday = isSameDay(dateObj, today)
                const isSelected = selectedDate ? isSameDay(dateObj, selectedDate) : false
                const isSunday = dateObj.getDay() === 0
                const isPast = dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate())

                return (
                  <button
                    key={dateKey}
                    type="button"
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      'relative border-b border-r border-border p-2 text-left transition-colors',
                      isSelected && 'bg-primary-50 ring-2 ring-inset ring-primary',
                      !isSelected && !isPast && 'hover:bg-gray-50',
                      isPast && !isToday && 'bg-gray-50/50',
                      isSunday && 'bg-red-50/30'
                    )}
                    style={{ minHeight: 90 }}
                  >
                    {/* Day number */}
                    <span
                      className={cn(
                        'inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium',
                        isToday && 'bg-primary text-white',
                        !isToday && isSunday && 'text-red-400',
                        !isToday && !isSunday && isPast && 'text-text-muted',
                        !isToday && !isSunday && !isPast && 'text-text-primary'
                      )}
                    >
                      {day}
                    </span>

                    {/* Appointment dots / previews */}
                    {dayAppointments.length > 0 && (
                      <div className="mt-1 space-y-0.5">
                        {dayAppointments.slice(0, 3).map((apt) => (
                          <div
                            key={apt.id}
                            className={cn(
                              'flex items-center gap-1 rounded px-1 py-0.5 text-[10px] leading-tight',
                              apt.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                              apt.status === 'confirmed' && 'bg-blue-100 text-blue-800',
                              apt.status === 'completed' && 'bg-emerald-100 text-emerald-800',
                              apt.status === 'cancelled' && 'bg-red-100 text-red-700 line-through'
                            )}
                          >
                            {apt.preferred_time === 'mattina' ? (
                              <Sun className="h-2.5 w-2.5 shrink-0" />
                            ) : (
                              <Sunset className="h-2.5 w-2.5 shrink-0" />
                            )}
                            <span className="truncate">{apt.name.split(' ')[0]}</span>
                          </div>
                        ))}
                        {dayAppointments.length > 3 && (
                          <p className="px-1 text-[10px] font-medium text-text-muted">
                            +{dayAppointments.length - 3} altri
                          </p>
                        )}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 border-t border-border px-4 py-3">
              {(
                [
                  ['pending', 'In Attesa'],
                  ['confirmed', 'Confermato'],
                  ['completed', 'Completato'],
                  ['cancelled', 'Annullato'],
                ] as const
              ).map(([status, label]) => (
                <div key={status} className="flex items-center gap-1.5">
                  <span className={cn('h-2.5 w-2.5 rounded-full', statusDot[status])} />
                  <span className="text-xs text-text-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Day Detail Sidebar ────────────────────────────────────── */}
          <div className="w-full shrink-0 lg:w-[380px]">
            {selectedDate ? (
              <div className="rounded-xl border border-border bg-white">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div>
                    <h3 className="text-sm font-semibold capitalize text-text-primary">
                      {formatDateLong(selectedDate)}
                    </h3>
                    <p className="text-xs text-text-muted">
                      {selectedDateAppointments.length} appuntament{selectedDateAppointments.length === 1 ? 'o' : 'i'}
                    </p>
                  </div>
                  <button
                    onClick={() => { setSelectedDate(null); setSelectedAppointment(null) }}
                    className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {selectedDateAppointments.length === 0 ? (
                  <div className="px-4 py-10 text-center">
                    <CalendarIcon className="mx-auto mb-2 h-8 w-8 text-text-muted/40" />
                    <p className="text-sm text-text-muted">Nessun appuntamento</p>
                  </div>
                ) : (
                  <div className="max-h-[600px] divide-y divide-border overflow-y-auto">
                    {/* Sort: mattina first */}
                    {selectedDateAppointments
                      .sort((a, b) => (a.preferred_time === 'mattina' ? -1 : 1) - (b.preferred_time === 'mattina' ? -1 : 1))
                      .map((apt) => (
                        <AppointmentCard
                          key={apt.id}
                          appointment={apt}
                          isExpanded={selectedAppointment?.id === apt.id}
                          onToggle={() =>
                            setSelectedAppointment((prev) =>
                              prev?.id === apt.id ? null : apt
                            )
                          }
                          onStatusChange={handleStatusChange}
                          isPending={isPending}
                        />
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border bg-white p-10 text-center">
                <div>
                  <CalendarIcon className="mx-auto mb-3 h-10 w-10 text-text-muted/30" />
                  <p className="text-sm font-medium text-text-muted">
                    Seleziona un giorno
                  </p>
                  <p className="mt-1 text-xs text-text-muted/70">
                    per vedere gli appuntamenti
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── List View ──────────────────────────────────────────────── */
        <div>
          {/* Status filters */}
          <div className="mb-4 flex flex-wrap gap-1 rounded-lg border border-border bg-white p-1">
            {(
              [
                { value: 'all' as const, label: 'Tutti' },
                { value: 'pending' as const, label: 'In Attesa' },
                { value: 'confirmed' as const, label: 'Confermati' },
                { value: 'completed' as const, label: 'Completati' },
                { value: 'cancelled' as const, label: 'Annullati' },
              ]
            ).map((tab) => {
              const count =
                tab.value === 'all'
                  ? appointments.length
                  : appointments.filter((a) => a.status === tab.value).length
              return (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    statusFilter === tab.value
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:bg-gray-100'
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      'inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium',
                      statusFilter === tab.value
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

          {/* Grouped by date */}
          {filteredAppointments.length === 0 ? (
            <div className="rounded-xl border border-border bg-white py-12 text-center text-sm text-text-muted">
              Nessun appuntamento trovato
            </div>
          ) : (
            <div className="space-y-3">
              {groupByDate(filteredAppointments).map(([dateKey, appts]) => (
                <div key={dateKey} className="rounded-xl border border-border bg-white">
                  <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold capitalize text-text-primary">
                      {formatDateLong(new Date(dateKey + 'T00:00:00'))}
                    </span>
                    <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary">
                      {appts.length}
                    </span>
                  </div>
                  <div className="divide-y divide-border">
                    {appts.map((apt) => (
                      <AppointmentCard
                        key={apt.id}
                        appointment={apt}
                        isExpanded={selectedAppointment?.id === apt.id}
                        onToggle={() =>
                          setSelectedAppointment((prev) =>
                            prev?.id === apt.id ? null : apt
                          )
                        }
                        onStatusChange={handleStatusChange}
                        isPending={isPending}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Appointment Card (shared between calendar sidebar + list) ─────────── */

function AppointmentCard({
  appointment,
  isExpanded,
  onToggle,
  onStatusChange,
  isPending,
}: {
  appointment: Appointment
  isExpanded: boolean
  onToggle: () => void
  onStatusChange: (id: string, status: AppointmentStatus) => void
  isPending: boolean
}) {
  const vehicleData = appointment.vehicle as
    | { brand: string; model: string; slug: string }
    | null
    | undefined

  return (
    <div className="transition-colors hover:bg-gray-50/50">
      {/* Summary row */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        {/* Time badge */}
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
            appointment.preferred_time === 'mattina'
              ? 'bg-amber-50 text-amber-600'
              : 'bg-indigo-50 text-indigo-600'
          )}
        >
          {appointment.preferred_time === 'mattina' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Sunset className="h-4 w-4" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">
              {appointment.name}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span>
              {appointment.preferred_time === 'mattina' ? '9:00 - 12:30' : '15:00 - 19:00'}
            </span>
            {vehicleData && (
              <>
                <span>&middot;</span>
                <span className="truncate">
                  {vehicleData.brand} {vehicleData.model}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Status dot */}
        <span
          className={cn(
            'h-2.5 w-2.5 shrink-0 rounded-full',
            statusDot[appointment.status]
          )}
          title={statusLabels[appointment.status]}
        />
      </button>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="border-t border-border bg-gray-50/50 px-4 py-4">
          <div className="space-y-3">
            {/* Contact info */}
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-3.5 w-3.5 text-text-muted" />
                <span className="text-text-primary">{appointment.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-3.5 w-3.5 text-text-muted" />
                <span className="text-text-primary">{appointment.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-3.5 w-3.5 text-text-muted" />
                <span className="text-text-primary">
                  {timeLabels[appointment.preferred_time] ?? appointment.preferred_time}
                </span>
              </div>
            </div>

            {/* Vehicle link */}
            {vehicleData && (
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-3.5 w-3.5 text-text-muted" />
                <Link
                  href={`/auto/${vehicleData.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-primary hover:text-primary-light"
                >
                  {vehicleData.brand} {vehicleData.model}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            )}

            {/* Notes */}
            {appointment.notes && (
              <div className="rounded-lg bg-white p-3 text-sm text-text-primary">
                {appointment.notes}
              </div>
            )}

            {/* Status buttons */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map(
                (s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onStatusChange(appointment.id, s)}
                    disabled={appointment.status === s || isPending}
                    className={cn(
                      'rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
                      appointment.status === s
                        ? cn(statusBadgeColors[s], 'cursor-default font-bold')
                        : 'border-border text-text-secondary hover:bg-white'
                    )}
                  >
                    {statusLabels[s]}
                  </button>
                )
              )}
            </div>

            {/* Quick contact actions */}
            <div className="flex items-center gap-2 border-t border-border pt-3">
              <a
                href={`mailto:${appointment.email}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-white"
              >
                <Mail className="h-3.5 w-3.5" />
                Email
              </a>
              <a
                href={`tel:${appointment.phone}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-white"
              >
                <Phone className="h-3.5 w-3.5" />
                Chiama
              </a>
              <a
                href={`https://wa.me/${appointment.phone.replace(/[^0-9+]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
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
}

/* ─── Group appointments by date for list view ──────────────────────────── */

function groupByDate(appointments: Appointment[]): [string, Appointment[]][] {
  const map = new Map<string, Appointment[]>()
  for (const apt of appointments) {
    const key = toDateKey(apt.preferred_date)
    const existing = map.get(key) ?? []
    existing.push(apt)
    map.set(key, existing)
  }
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
}
