import { requireAuth } from '@/lib/supabase/auth'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { AdminTopBar } from '@/components/layout/AdminTopBar'
import { VehicleTable } from '@/components/admin/VehicleTable'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import type { Vehicle } from '@/types'

export default async function AdminVeicoliPage() {
  await requireAuth()

  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('vehicles')
    .select('*, images:vehicle_images(*)')
    .order('created_at', { ascending: false })

  const vehicles: Vehicle[] = error
    ? []
    : (data ?? []).map((vehicle) => ({
        ...vehicle,
        images: vehicle.images?.sort(
          (a: { position: number }, b: { position: number }) =>
            a.position - b.position
        ),
      })) as Vehicle[]

  return (
    <>
      <AdminTopBar title="Veicoli">
        <Button href="/admin/veicoli/nuovo" variant="primary" size="sm">
          <Plus className="h-4 w-4" />
          Aggiungi Veicolo
        </Button>
      </AdminTopBar>

      <VehicleTable vehicles={vehicles} />
    </>
  )
}
