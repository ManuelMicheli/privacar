'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { vehicleSchema } from '@/lib/schemas/vehicle'
import { generateSlug, ensureUniqueSlug } from '@/lib/utils/slug'
import { revalidatePath } from 'next/cache'

// ─── Helper: parse form data to vehicle data object ─────────────────────────

function parseVehicleFormData(formData: FormData) {
  const raw: Record<string, unknown> = {}

  raw.brand = formData.get('brand') as string
  raw.model = formData.get('model') as string
  raw.version = (formData.get('version') as string) || null
  raw.year = Number(formData.get('year'))
  raw.mileage = Number(formData.get('mileage'))
  raw.fuel_type = formData.get('fuel_type') as string
  raw.transmission = formData.get('transmission') as string
  raw.power_hp = formData.get('power_hp')
    ? Number(formData.get('power_hp'))
    : null
  raw.power_kw = formData.get('power_kw')
    ? Number(formData.get('power_kw'))
    : null
  raw.engine_cc = formData.get('engine_cc')
    ? Number(formData.get('engine_cc'))
    : null
  raw.body_type = (formData.get('body_type') as string) || null
  raw.color_exterior = (formData.get('color_exterior') as string) || null
  raw.color_interior = (formData.get('color_interior') as string) || null
  raw.doors = formData.get('doors') ? Number(formData.get('doors')) : null
  raw.seats = formData.get('seats') ? Number(formData.get('seats')) : null
  raw.emission_class = (formData.get('emission_class') as string) || null
  raw.drive_type = (formData.get('drive_type') as string) || null
  raw.new_driver_ok = formData.get('new_driver_ok') === 'true'
  raw.price = Number(formData.get('price'))
  raw.monthly_payment = formData.get('monthly_payment')
    ? Number(formData.get('monthly_payment'))
    : null
  raw.description = (formData.get('description') as string) || null
  raw.is_featured = formData.get('is_featured') === 'true'
  raw.status = (formData.get('status') as string) || 'disponibile'

  // Parse features JSON
  const featuresStr = formData.get('features') as string
  raw.features = featuresStr ? JSON.parse(featuresStr) : {}

  return raw
}

// ─── Create Vehicle ─────────────────────────────────────────────────────────

export async function createVehicle(formData: FormData) {
  const raw = parseVehicleFormData(formData)

  const parsed = vehicleSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || 'Dati non validi',
    }
  }

  try {
    const supabase = await createServerSupabaseClient()

    // Generate unique slug
    const baseSlug = generateSlug(
      parsed.data.brand,
      parsed.data.model,
      parsed.data.version ?? null,
      parsed.data.year
    )

    const { data: existingSlugs } = await supabase
      .from('vehicles')
      .select('slug')
    const slugList = (existingSlugs ?? []).map((s) => s.slug)
    const slug = ensureUniqueSlug(baseSlug, slugList)

    // Use custom slug if provided
    const customSlug = formData.get('slug') as string
    const finalSlug = customSlug && customSlug.trim() ? customSlug.trim() : slug

    const { data, error } = await supabase
      .from('vehicles')
      .insert({
        ...parsed.data,
        slug: finalSlug,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error creating vehicle:', error)
      return {
        success: false,
        error: 'Errore durante la creazione del veicolo.',
      }
    }

    revalidatePath('/auto')
    revalidatePath('/admin/veicoli')
    revalidatePath('/')

    return { success: true, id: data.id }
  } catch (err) {
    console.error('Error creating vehicle:', err)
    return {
      success: false,
      error: 'Si è verificato un errore. Riprova più tardi.',
    }
  }
}

// ─── Update Vehicle ─────────────────────────────────────────────────────────

export async function updateVehicle(id: string, formData: FormData) {
  const raw = parseVehicleFormData(formData)

  const parsed = vehicleSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || 'Dati non validi',
    }
  }

  try {
    const supabase = await createServerSupabaseClient()

    // Use custom slug if provided, otherwise regenerate
    const customSlug = formData.get('slug') as string
    let finalSlug: string

    if (customSlug && customSlug.trim()) {
      finalSlug = customSlug.trim()
    } else {
      const baseSlug = generateSlug(
        parsed.data.brand,
        parsed.data.model,
        parsed.data.version ?? null,
        parsed.data.year
      )
      const { data: existingSlugs } = await supabase
        .from('vehicles')
        .select('slug')
        .neq('id', id)
      const slugList = (existingSlugs ?? []).map((s) => s.slug)
      finalSlug = ensureUniqueSlug(baseSlug, slugList)
    }

    const { error } = await supabase
      .from('vehicles')
      .update({
        ...parsed.data,
        slug: finalSlug,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating vehicle:', error)
      return {
        success: false,
        error: 'Errore durante l\'aggiornamento del veicolo.',
      }
    }

    revalidatePath('/auto')
    revalidatePath(`/auto/${finalSlug}`)
    revalidatePath('/admin/veicoli')
    revalidatePath('/')

    return { success: true }
  } catch (err) {
    console.error('Error updating vehicle:', err)
    return {
      success: false,
      error: 'Si è verificato un errore. Riprova più tardi.',
    }
  }
}

// ─── Delete Vehicle ─────────────────────────────────────────────────────────

export async function deleteVehicle(id: string) {
  try {
    const supabase = await createServerSupabaseClient()

    // Get vehicle images to delete from storage
    const { data: images } = await supabase
      .from('vehicle_images')
      .select('url')
      .eq('vehicle_id', id)

    // Delete images from storage
    if (images && images.length > 0) {
      const filePaths = images
        .map((img) => {
          const url = img.url as string
          // Extract file path from URL (after /vehicle-images/)
          const match = url.match(/vehicle-images\/(.+)$/)
          return match ? match[1] : null
        })
        .filter(Boolean) as string[]

      if (filePaths.length > 0) {
        await supabase.storage.from('vehicle-images').remove(filePaths)
      }
    }

    // Delete the vehicle (cascade will delete vehicle_images rows)
    const { error } = await supabase.from('vehicles').delete().eq('id', id)

    if (error) {
      console.error('Error deleting vehicle:', error)
      return {
        success: false,
        error: 'Errore durante l\'eliminazione del veicolo.',
      }
    }

    revalidatePath('/auto')
    revalidatePath('/admin/veicoli')
    revalidatePath('/')

    return { success: true }
  } catch (err) {
    console.error('Error deleting vehicle:', err)
    return {
      success: false,
      error: 'Si è verificato un errore. Riprova più tardi.',
    }
  }
}

// ─── Toggle Featured ────────────────────────────────────────────────────────

export async function toggleFeatured(id: string, isFeatured: boolean) {
  try {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
      .from('vehicles')
      .update({ is_featured: isFeatured, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Error toggling featured:', error)
      return { success: false, error: 'Errore durante l\'aggiornamento.' }
    }

    revalidatePath('/admin/veicoli')
    revalidatePath('/')

    return { success: true }
  } catch (err) {
    console.error('Error toggling featured:', err)
    return {
      success: false,
      error: 'Si è verificato un errore.',
    }
  }
}

// ─── Upload Vehicle Image ───────────────────────────────────────────────────

export async function uploadVehicleImage(
  vehicleId: string,
  fileBase64: string,
  fileName: string,
  contentType: string,
  position: number,
  isCover: boolean
) {
  try {
    const supabase = await createServerSupabaseClient()

    // Decode base64 to buffer
    const buffer = Buffer.from(fileBase64, 'base64')

    // Generate unique file name
    const ext = fileName.split('.').pop() || 'jpg'
    const uniqueName = `${vehicleId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('vehicle-images')
      .upload(uniqueName, buffer, {
        contentType,
        cacheControl: '31536000',
        upsert: false,
      })

    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      return { success: false, error: 'Errore durante il caricamento dell\'immagine.' }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('vehicle-images')
      .getPublicUrl(uniqueName)

    // If this is the cover, unset any existing cover
    if (isCover) {
      await supabase
        .from('vehicle_images')
        .update({ is_cover: false })
        .eq('vehicle_id', vehicleId)
    }

    // Insert record in vehicle_images
    const { data, error: dbError } = await supabase
      .from('vehicle_images')
      .insert({
        vehicle_id: vehicleId,
        url: urlData.publicUrl,
        position,
        is_cover: isCover,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Error inserting image record:', dbError)
      return { success: false, error: 'Errore durante il salvataggio dell\'immagine.' }
    }

    revalidatePath('/admin/veicoli')

    return { success: true, image: data }
  } catch (err) {
    console.error('Error uploading vehicle image:', err)
    return {
      success: false,
      error: 'Si è verificato un errore. Riprova più tardi.',
    }
  }
}

// ─── Delete Vehicle Image ───────────────────────────────────────────────────

export async function deleteVehicleImage(imageId: string, imageUrl: string) {
  try {
    const supabase = await createServerSupabaseClient()

    // Extract file path from URL
    const match = imageUrl.match(/vehicle-images\/(.+)$/)
    if (match) {
      await supabase.storage.from('vehicle-images').remove([match[1]])
    }

    // Delete DB record
    const { error } = await supabase
      .from('vehicle_images')
      .delete()
      .eq('id', imageId)

    if (error) {
      console.error('Error deleting image record:', error)
      return { success: false, error: 'Errore durante l\'eliminazione dell\'immagine.' }
    }

    revalidatePath('/admin/veicoli')

    return { success: true }
  } catch (err) {
    console.error('Error deleting vehicle image:', err)
    return {
      success: false,
      error: 'Si è verificato un errore.',
    }
  }
}

// ─── Reorder Images ─────────────────────────────────────────────────────────

export async function reorderImages(vehicleId: string, imageIds: string[]) {
  try {
    const supabase = await createServerSupabaseClient()

    // Update position for each image
    const updates = imageIds.map((id, index) =>
      supabase
        .from('vehicle_images')
        .update({ position: index })
        .eq('id', id)
        .eq('vehicle_id', vehicleId)
    )

    await Promise.all(updates)

    revalidatePath('/admin/veicoli')

    return { success: true }
  } catch (err) {
    console.error('Error reordering images:', err)
    return {
      success: false,
      error: 'Si è verificato un errore.',
    }
  }
}
