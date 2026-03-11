'use client'

import { CustomizableGrid, type WidgetConfig } from './CustomizableGrid'
import { AppointmentsCalendar } from './AppointmentsCalendar'
import { GoogleCalendarPanel } from './GoogleCalendarPanel'
import { CalendarDays, Settings, Calendar } from 'lucide-react'
import type { Appointment } from '@/types'
import Link from 'next/link'

interface CalendarContentProps {
  appointments: Appointment[]
  googleConnected: boolean
}

export function CalendarContent({
  appointments,
  googleConnected,
}: CalendarContentProps) {
  const widgets: WidgetConfig[] = [
    {
      id: 'appointments-calendar',
      title: 'Calendario Appuntamenti',
      icon: <CalendarDays className="h-4 w-4" />,
      defaultColSpan: 2,
      content: <AppointmentsCalendar appointments={appointments} />,
    },
    {
      id: 'google-calendar',
      title: 'Google Calendar',
      icon: <Calendar className="h-4 w-4" />,
      defaultColSpan: 1,
      content: googleConnected ? (
        <GoogleCalendarPanel />
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-heading text-base font-bold text-text-primary">
              Google Calendar
            </h3>
            <p className="max-w-[240px] text-sm text-text-muted">
              Collega il tuo account Google per vedere e gestire il calendario
              direttamente da qui.
            </p>
            <Link
              href="/admin/impostazioni"
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#065F46] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#047857]"
            >
              <Settings className="h-4 w-4" />
              Vai alle Impostazioni
            </Link>
          </div>
        </div>
      ),
    },
  ]

  return (
    <CustomizableGrid
      widgets={widgets}
      storageKey="privacar-calendar-layout"
      cols={3}
    />
  )
}
