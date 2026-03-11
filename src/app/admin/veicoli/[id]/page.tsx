import { requireAuth } from '@/lib/supabase/auth'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { AdminTopBar } from '@/components/layout/AdminTopBar'
import { VehicleForm } from '@/components/admin/VehicleForm'
import { notFound } from 'next/navigation'
import type { Vehicle } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditVeicoloPage({ params }: Props) {
  await requireAuth()
  const { id } = await params

  // Validate UUID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    notFound()
  }

  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('vehicles')
    .select('*, images:vehicle_images(*)')
    .eq('id', id)
    .single()

  if (error || !data) {
    notFound()
  }

  const vehicle: Vehicle = {
    ...data,
    images: data.images?.sort(
      (a: { position: number }, b: { position: number }) =>
        a.position - b.position
    ),
  } as Vehicle

  return (
    <>
      <AdminTopBar title={`Modifica: ${vehicle.brand} ${vehicle.model}`} />
      <VehicleForm vehicle={vehicle} />
    </>
  )
}
