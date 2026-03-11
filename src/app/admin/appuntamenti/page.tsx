import { requireAuth } from '@/lib/supabase/auth'
import { getAppointments } from '@/lib/queries/appointments'
import { getGoogleIntegrationStatus } from '@/lib/actions/google-actions'
import { AdminTopBar } from '@/components/layout/AdminTopBar'
import { CalendarContent } from '@/components/admin/CalendarContent'

export default async function AdminAppuntamentiPage() {
  await requireAuth()

  const [appointments, googleStatus] = await Promise.all([
    getAppointments(),
    getGoogleIntegrationStatus(),
  ])

  return (
    <>
      <AdminTopBar title="Appuntamenti" />

      <CalendarContent
        appointments={appointments}
        googleConnected={googleStatus.connected}
      />
    </>
  )
}
