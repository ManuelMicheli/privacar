'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSetting(key: string, value: unknown) {
  try {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
      .from('site_settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key)

    if (error) {
      console.error('Error updating setting:', error)
      return { success: false, error: 'Errore durante il salvataggio.' }
    }

    revalidatePath('/')
    revalidatePath('/admin/impostazioni')

    return { success: true }
  } catch (err) {
    console.error('Error updating setting:', err)
    return {
      success: false,
      error: 'Si è verificato un errore. Riprova più tardi.',
    }
  }
}
