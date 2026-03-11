'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export interface GoogleIntegrationStatus {
  connected: boolean
  email: string | null
  scopes: string[]
}

export async function getGoogleIntegrationStatus(): Promise<GoogleIntegrationStatus> {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { connected: false, email: null, scopes: [] }

    const admin = createAdminClient()
    const { data, error } = await admin
      .from('google_integrations')
      .select('email, scopes, token_expiry')
      .eq('user_id', user.id)
      .single()

    if (error || !data) return { connected: false, email: null, scopes: [] }

    return {
      connected: true,
      email: data.email,
      scopes: data.scopes ?? [],
    }
  } catch {
    return { connected: false, email: null, scopes: [] }
  }
}

export async function disconnectGoogle(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Non autenticato' }

    const admin = createAdminClient()

    // Revoke the token with Google
    const { data: integration } = await admin
      .from('google_integrations')
      .select('access_token')
      .eq('user_id', user.id)
      .single()

    if (integration?.access_token) {
      // Best effort revoke — don't fail if Google is unreachable
      try {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${integration.access_token}`, {
          method: 'POST',
        })
      } catch {
        // Ignore revoke errors
      }
    }

    // Delete from database
    const { error } = await admin
      .from('google_integrations')
      .delete()
      .eq('user_id', user.id)

    if (error) throw error

    return { success: true }
  } catch {
    return { success: false, error: 'Errore durante la disconnessione' }
  }
}
