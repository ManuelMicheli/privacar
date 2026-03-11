'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { appointmentSchema } from '@/lib/schemas/appointment'
import { revalidatePath } from 'next/cache'

export async function submitAppointment(formData: unknown) {
  const parsed = appointmentSchema.safeParse(formData)

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || 'Dati non validi',
    }
  }

  try {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase
      .from('appointments')
      .insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        preferred_date: parsed.data.preferred_date,
        preferred_time: parsed.data.preferred_time,
        notes: parsed.data.notes || null,
        vehicle_id: parsed.data.vehicle_id || null,
        status: 'pending',
      })

    if (error) {
      console.error('Error inserting appointment:', error)
      return {
        success: false,
        error: 'Si è verificato un errore. Riprova più tardi.',
      }
    }

    return { success: true }
  } catch (err) {
    console.error('Error submitting appointment:', err)
    return {
      success: false,
      error: 'Si è verificato un errore. Riprova più tardi.',
    }
  }
}

export async function updateAppointmentStatus(id: string, status: string) {
  try {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error('Error updating appointment status:', error)
      return { success: false, error: 'Errore durante l\'aggiornamento.' }
    }

    revalidatePath('/admin/appuntamenti')
    revalidatePath('/admin')

    return { success: true }
  } catch (err) {
    console.error('Error updating appointment status:', err)
    return {
      success: false,
      error: 'Si è verificato un errore.',
    }
  }
}
