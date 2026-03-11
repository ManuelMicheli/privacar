import { requireAuth } from '@/lib/supabase/auth'
import { getContacts } from '@/lib/queries/contacts'
import { AdminTopBar } from '@/components/layout/AdminTopBar'
import { ContactsList } from '@/components/admin/ContactsList'

export default async function AdminContattiPage() {
  await requireAuth()

  const contacts = await getContacts()

  return (
    <>
      <AdminTopBar title="Contatti" />
      <ContactsList contacts={contacts} />
    </>
  )
}
