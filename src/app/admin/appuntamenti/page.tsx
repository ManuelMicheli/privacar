import { requireAuth } from '@/lib/supabase/auth'
import { getAppointments } from '@/lib/queries/appointments'
import { getGoogleIntegrationStatus } from '@/lib/actions/google-actions'
import { AdminTopBar } from '@/components/layout/AdminTopBar'
import { AppointmentsCalendar } from '@/components/admin/AppointmentsCalendar'
import { GoogleCalendarPanel } from '@/components/admin/GoogleCalendarPanel'
import Link from 'next/link'
import { Settings } from 'lucide-react'

export default async function AdminAppuntamentiPage() {
  await requireAuth()

  const [appointments, googleStatus] = await Promise.all([
    getAppointments(),
    getGoogleIntegrationStatus(),
  ])

  return (
    <>
      <AdminTopBar title="Appuntamenti" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Appuntamenti interni — 2/3 */}
        <div className="xl:col-span-2">
          <AppointmentsCalendar appointments={appointments} />
        </div>

        {/* Google Calendar — 1/3 */}
        <div>
          {googleStatus.connected ? (
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
          )}
        </div>
      </div>
    </>
  )
}
