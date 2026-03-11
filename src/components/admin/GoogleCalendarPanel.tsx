'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Pencil,
  Trash2,
  X,
  Loader2,
  ExternalLink,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from '@/lib/actions/calendar-actions'
import type { CalendarEvent } from '@/lib/google/calendar'
import toast from 'react-hot-toast'

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatTime(dateTime: string) {
  return new Date(dateTime).toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDateFull(dateTime: string) {
  return new Date(dateTime).toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function formatDateShort(date: Date) {
  return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
}

function getWeekRange(offset: number) {
  const now = new Date()
  const start = new Date(now)
  start.setDate(now.getDate() - now.getDay() + 1 + offset * 7) // Monday
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(start.getDate() + 6) // Sunday
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

function getDaysOfWeek(start: Date) {
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    days.push(d)
  }
  return days
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isToday(date: Date) {
  return isSameDay(date, new Date())
}

const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

// ─── Event Form Modal ───────────────────────────────────────────────────────

interface EventFormData {
  summary: string
  description: string
  location: string
  date: string
  startTime: string
  endTime: string
}

const emptyForm: EventFormData = {
  summary: '',
  description: '',
  location: '',
  date: new Date().toISOString().split('T')[0],
  startTime: '09:00',
  endTime: '10:00',
}

function EventFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
  title,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: EventFormData) => void
  initialData: EventFormData
  loading: boolean
  title: string
}) {
  const [form, setForm] = useState<EventFormData>(initialData)

  useEffect(() => {
    if (isOpen) setForm(initialData)
  }, [isOpen, initialData])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-text-primary">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(form)
          }}
          className="space-y-4"
        >
          {/* Titolo */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Titolo *
            </label>
            <input
              type="text"
              required
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-text-primary transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              placeholder="es. Appuntamento con cliente"
            />
          </div>

          {/* Data + Orari */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Data *
              </label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-text-primary transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Inizio *
              </label>
              <input
                type="time"
                required
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-text-primary transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Fine *
              </label>
              <input
                type="time"
                required
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-text-primary transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          {/* Luogo */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Luogo
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-text-primary transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              placeholder="es. Privacar Rho, Via Madonna 23"
            />
          </div>

          {/* Descrizione */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Note
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-text-primary transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              placeholder="Dettagli aggiuntivi..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#065F46] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#047857] disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Salvataggio...' : 'Salva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function GoogleCalendarPanel() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDay, setSelectedDay] = useState<Date>(new Date())

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [modalLoading, setModalLoading] = useState(false)

  // Delete confirm
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { start: weekStart, end: weekEnd } = getWeekRange(weekOffset)
  const daysOfWeek = getDaysOfWeek(weekStart)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { events: fetched, error: err } = await getCalendarEvents({
      timeMin: weekStart.toISOString(),
      timeMax: weekEnd.toISOString(),
    })
    if (err) {
      setError(err)
    } else {
      setEvents(fetched)
    }
    setLoading(false)
  }, [weekStart.toISOString(), weekEnd.toISOString()])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  // Events for selected day
  const dayEvents = events.filter((e) =>
    isSameDay(new Date(e.start.dateTime), selectedDay)
  )

  // Events count per day (for week view dots)
  function eventsForDay(day: Date) {
    return events.filter((e) =>
      isSameDay(new Date(e.start.dateTime), day)
    )
  }

  // ─── Handlers ───────────────────────────────────────────────────────────

  function openCreateModal(date?: Date) {
    const d = date ?? selectedDay
    setModalMode('create')
    setEditingEvent(null)
    setModalOpen(true)
    // We set initialData via the form default
    setSelectedDay(d)
  }

  function openEditModal(event: CalendarEvent) {
    setModalMode('edit')
    setEditingEvent(event)
    setModalOpen(true)
  }

  async function handleSubmit(data: EventFormData) {
    setModalLoading(true)

    const startISO = `${data.date}T${data.startTime}:00`
    const endISO = `${data.date}T${data.endTime}:00`

    if (modalMode === 'create') {
      const { error: err } = await createCalendarEvent({
        summary: data.summary,
        description: data.description || undefined,
        location: data.location || undefined,
        start: startISO,
        end: endISO,
      })
      if (err) {
        toast.error(err)
      } else {
        toast.success('Evento creato')
        setModalOpen(false)
        fetchEvents()
      }
    } else if (editingEvent) {
      const { error: err } = await updateCalendarEvent(editingEvent.id, {
        summary: data.summary,
        description: data.description || undefined,
        location: data.location || undefined,
        start: startISO,
        end: endISO,
      })
      if (err) {
        toast.error(err)
      } else {
        toast.success('Evento aggiornato')
        setModalOpen(false)
        fetchEvents()
      }
    }

    setModalLoading(false)
  }

  async function handleDelete(eventId: string) {
    setDeletingId(eventId)
    const { error: err } = await deleteCalendarEvent(eventId)
    if (err) {
      toast.error(err)
    } else {
      toast.success('Evento eliminato')
      fetchEvents()
    }
    setDeletingId(null)
  }

  // ─── Form initial data ─────────────────────────────────────────────────

  const formInitialData: EventFormData =
    modalMode === 'edit' && editingEvent
      ? {
          summary: editingEvent.summary ?? '',
          description: editingEvent.description ?? '',
          location: editingEvent.location ?? '',
          date: editingEvent.start.dateTime.split('T')[0],
          startTime: formatTime(editingEvent.start.dateTime),
          endTime: formatTime(editingEvent.end.dateTime),
        }
      : {
          ...emptyForm,
          date: selectedDay.toISOString().split('T')[0],
        }

  // ─── Week label ─────────────────────────────────────────────────────────

  const weekLabel = `${formatDateShort(weekStart)} - ${formatDateShort(weekEnd)}`
  const isCurrentWeek = weekOffset === 0

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="rounded-2xl border border-gray-100 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <Calendar className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h2 className="font-heading text-base font-bold text-text-primary">
              Google Calendar
            </h2>
            <p className="text-xs text-text-muted">{weekLabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isCurrentWeek && (
            <button
              onClick={() => setWeekOffset(0)}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
            >
              Oggi
            </button>
          )}
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => openCreateModal()}
            className="ml-2 inline-flex items-center gap-1.5 rounded-xl bg-[#065F46] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#047857]"
          >
            <Plus className="h-3.5 w-3.5" />
            Evento
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-5 mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Week strip */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {daysOfWeek.map((day, i) => {
          const dayEvts = eventsForDay(day)
          const selected = isSameDay(day, selectedDay)
          const today = isToday(day)

          return (
            <button
              key={i}
              onClick={() => setSelectedDay(day)}
              className={cn(
                'flex flex-col items-center gap-1 px-1 py-3 transition-colors',
                selected
                  ? 'bg-primary/5'
                  : 'hover:bg-gray-50',
                i < 6 && 'border-r border-gray-50'
              )}
            >
              <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                {DAY_LABELS[i]}
              </span>
              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
                  today && selected
                    ? 'bg-primary text-white'
                    : today
                      ? 'bg-primary/10 text-primary'
                      : selected
                        ? 'bg-primary text-white'
                        : 'text-text-primary'
                )}
              >
                {day.getDate()}
              </span>
              {/* Event dots */}
              <div className="flex gap-0.5">
                {dayEvts.slice(0, 3).map((_, j) => (
                  <span
                    key={j}
                    className="h-1 w-1 rounded-full bg-blue-500"
                  />
                ))}
                {dayEvts.length > 3 && (
                  <span className="h-1 w-1 rounded-full bg-gray-300" />
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Day events list */}
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold capitalize text-text-primary">
            {formatDateFull(selectedDay.toISOString())}
          </h3>
          <span className="text-xs text-text-muted">
            {dayEvents.length} {dayEvents.length === 1 ? 'evento' : 'eventi'}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
          </div>
        ) : dayEvents.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Calendar className="h-8 w-8 text-gray-200" />
            <p className="text-sm text-text-muted">Nessun evento</p>
            <button
              onClick={() => openCreateModal()}
              className="mt-1 text-xs font-medium text-primary hover:text-primary-light"
            >
              + Aggiungi evento
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className="group rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 transition-colors hover:border-gray-200 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-primary">
                      {event.summary}
                    </p>

                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-text-muted">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(event.start.dateTime)} -{' '}
                        {formatTime(event.end.dateTime)}
                      </span>
                      {event.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                      )}
                    </div>

                    {event.description && (
                      <p className="mt-2 text-xs leading-relaxed text-text-muted">
                        {event.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    {event.htmlLink && (
                      <a
                        href={event.htmlLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white hover:text-blue-600"
                        title="Apri in Google Calendar"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => openEditModal(event)}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white hover:text-primary"
                      title="Modifica"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      disabled={deletingId === event.id}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white hover:text-red-600 disabled:opacity-50"
                      title="Elimina"
                    >
                      {deletingId === event.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event form modal */}
      <EventFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={formInitialData}
        loading={modalLoading}
        title={modalMode === 'create' ? 'Nuovo Evento' : 'Modifica Evento'}
      />
    </div>
  )
}
