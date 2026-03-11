import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { ContactRequest } from '@/types'

// ─── Get All Contacts ───────────────────────────────────────────────────────

export interface ContactFilters {
  is_read?: boolean
  request_type?: string
}

export async function getContacts(
  filters?: ContactFilters
): Promise<ContactRequest[]> {
  try {
    const supabase = await createServerSupabaseClient()

    let query = supabase
      .from('contact_requests')
      .select('*, vehicle:vehicles(id, brand, model, slug)')
      .order('created_at', { ascending: false })

    if (filters?.is_read !== undefined) {
      query = query.eq('is_read', filters.is_read)
    }

    if (filters?.request_type) {
      query = query.eq('request_type', filters.request_type)
    }

    const { data, error } = await query

    if (error) throw error

    return (data ?? []) as ContactRequest[]
  } catch (err) {
    console.error('Error fetching contacts:', err)
    return []
  }
}

// ─── Get Unread Count ───────────────────────────────────────────────────────

export async function getUnreadCount(): Promise<number> {
  try {
    const supabase = await createServerSupabaseClient()

    const { count, error } = await supabase
      .from('contact_requests')
      .select('id', { count: 'exact', head: true })
      .eq('is_read', false)

    if (error) throw error

    return count ?? 0
  } catch {
    return 0
  }
}
