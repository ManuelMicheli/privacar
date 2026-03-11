import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Appointment } from '@/types'

// ─── Get All Appointments ───────────────────────────────────────────────────

export interface AppointmentFilters {
  status?: string
}

export async function getAppointments(
  filters?: AppointmentFilters
): Promise<Appointment[]> {
  try {
    const supabase = await createServerSupabaseClient()

    let query = supabase
      .from('appointments')
      .select('*, vehicle:vehicles(id, brand, model, slug)')
      .order('preferred_date', { ascending: true })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    const { data, error } = await query

    if (error) throw error

    return (data ?? []) as Appointment[]
  } catch (err) {
    console.error('Error fetching appointments:', err)
    return []
  }
}

// ─── Get Pending Count ──────────────────────────────────────────────────────

export async function getPendingCount(): Promise<number> {
  try {
    const supabase = await createServerSupabaseClient()

    const { count, error } = await supabase
      .from('appointments')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')

    if (error) throw error

    return count ?? 0
  } catch {
    return 0
  }
}
