import { getUser } from '@/lib/supabase/auth'
import { getUnreadCount } from '@/lib/queries/contacts'
import { getPendingCount } from '@/lib/queries/appointments'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { CustomToaster } from '@/components/ui/Toast'

export const metadata = {
  title: {
    default: 'Gestionale | Privacar Rho',
    template: '%s | Gestionale Privacar',
  },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  // If not authenticated, render children directly (login page)
  if (!user) {
    return (
      <>
        {children}
        <CustomToaster />
      </>
    )
  }

  // Fetch badge counts in parallel
  const [unreadContacts, pendingAppointments] = await Promise.all([
    getUnreadCount(),
    getPendingCount(),
  ])

  return (
    <div className="flex min-h-screen bg-[#F5F6F8]">
      <AdminSidebar
        userEmail={user.email ?? ''}
        unreadContacts={unreadContacts}
        pendingAppointments={pendingAppointments}
      />

      {/* Main content area */}
      <main className="flex-1 lg:ml-[260px]">
        <div className="min-h-screen p-4 pt-16 sm:p-6 sm:pt-6 lg:p-8">
          {children}
        </div>
      </main>

      <CustomToaster />
    </div>
  )
}
