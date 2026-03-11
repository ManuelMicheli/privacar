import { requireAuth } from '@/lib/supabase/auth'
import { AdminTopBar } from '@/components/layout/AdminTopBar'
import { VehicleForm } from '@/components/admin/VehicleForm'

export default async function NuovoVeicoloPage() {
  await requireAuth()

  return (
    <>
      <AdminTopBar title="Nuovo Veicolo" />
      <VehicleForm />
    </>
  )
}
