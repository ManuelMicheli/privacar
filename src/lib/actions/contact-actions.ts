'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { contactRequestSchema } from '@/lib/schemas/contact'
import { revalidatePath } from 'next/cache'

export async function submitContactRequest(formData: unknown) {
  const parsed = contactRequestSchema.safeParse(formData)

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || 'Dati non validi',
    }
  }

  try {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase
      .from('contact_requests')
      .insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        message: parsed.data.message || null,
        request_type: parsed.data.request_type,
        vehicle_id: parsed.data.vehicle_id || null,
      })

    if (error) {
      console.error('Error inserting contact request:', error)
      return {
        success: false,
        error: 'Si è verificato un errore. Riprova più tardi.',
      }
    }

    return { success: true }
  } catch (err) {
    console.error('Error submitting contact request:', err)
    return {
      success: false,
      error: 'Si è verificato un errore. Riprova più tardi.',
    }
  }
}

export async function markAsRead(id: string) {
  try {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
      .from('contact_requests')
      .update({ is_read: true })
      .eq('id', id)

    if (error) {
      console.error('Error marking contact as read:', error)
      return { success: false, error: 'Errore durante l\'aggiornamento.' }
    }

    revalidatePath('/admin/contatti')
    revalidatePath('/admin')

    return { success: true }
  } catch (err) {
    console.error('Error marking contact as read:', err)
    return {
      success: false,
      error: 'Si è verificato un errore.',
    }
  }
}
