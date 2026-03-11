import { requireAuth } from '@/lib/supabase/auth'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { AdminTopBar } from '@/components/layout/AdminTopBar'
import { DashboardContent } from '@/components/admin/DashboardContent'
import type { DashboardStats } from '@/components/admin/StatsCards'
import { getContacts, getUnreadCount } from '@/lib/queries/contacts'
import { getAppointments, getPendingCount } from '@/lib/queries/appointments'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buongiorno'
  if (hour < 18) return 'Buon pomeriggio'
  return 'Buonasera'
}

export default async function AdminDashboardPage() {
  const user = await requireAuth()

  const supabase = await createServerSupabaseClient()

  // Fetch all data in parallel
  const [
    { count: disponibiliCount },
    { count: riservateCount },
    { count: venduteCount },
    unreadContacts,
    pendingAppointments,
    recentContacts,
    recentAppointments,
  ] = await Promise.all([
    supabase
      .from('vehicles')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'disponibile')
      .then((r) => ({ count: r.count ?? 0 })),
    supabase
      .from('vehicles')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'riservata')
      .then((r) => ({ count: r.count ?? 0 })),
    supabase
      .from('vehicles')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'venduta')
      .then((r) => ({ count: r.count ?? 0 })),
    getUnreadCount(),
    getPendingCount(),
    getContacts().then((c) => c.slice(0, 5)),
    getAppointments().then((a) => a.slice(0, 5)),
  ])

  const stats: DashboardStats = {
    disponibili: disponibiliCount,
    riservate: riservateCount,
    vendute: venduteCount,
    unreadContacts,
    pendingAppointments,
  }

  const userName = user.email?.split('@')[0] ?? ''

  return (
    <>
      <AdminTopBar
        title={`${getGreeting()}, ${userName}`}
        subtitle="Ecco il riepilogo della tua attivita'"
      />

      <DashboardContent
        stats={stats}
        contacts={recentContacts}
        appointments={recentAppointments}
      />
    </>
  )
}
