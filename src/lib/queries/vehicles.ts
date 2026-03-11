import { cache } from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Vehicle } from '@/types'
import { ITEMS_PER_PAGE } from '@/lib/utils/constants'
import { mockVehicles } from '@/lib/mock-data'

// Supabase connection timeout (ms) — fail fast, fall back to mock data
const QUERY_TIMEOUT = 3000

// ─── Result Types ──────────────────────────────────────────────────────────

export interface GetVehiclesResult {
  vehicles: Vehicle[]
  count: number
}

// ─── Get Featured Vehicles ─────────────────────────────────────────────────

export async function getFeaturedVehicles(): Promise<Vehicle[]> {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await Promise.race([
      supabase
        .from('vehicles')
        .select('*, images:vehicle_images(*)')
        .eq('is_featured', true)
        .eq('status', 'disponibile')
        .order('created_at', { ascending: false })
        .limit(6),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), QUERY_TIMEOUT)
      ),
    ])

    if (error) throw error

    return (data ?? []).map((vehicle) => ({
      ...vehicle,
      images: vehicle.images?.sort(
        (a: { position: number }, b: { position: number }) =>
          a.position - b.position
      ),
    })) as Vehicle[]
  } catch {
    return mockVehicles
      .filter((v) => v.is_featured && v.status === 'disponibile')
      .slice(0, 6)
  }
}

// ─── Get Vehicles with Filters ─────────────────────────────────────────────

export async function getVehicles(
  filters: Record<string, string | undefined> = {}
): Promise<GetVehiclesResult> {
  try {
    const supabase = await createServerSupabaseClient()

    let query = supabase
      .from('vehicles')
      .select('*, images:vehicle_images(*)', { count: 'exact' })
      .eq('status', 'disponibile')

    // ── Apply filters ────────────────────────────────────────────────────

    if (filters.brand) {
      query = query.ilike('brand', filters.brand)
    }

    if (filters.model) {
      query = query.ilike('model', filters.model)
    }

    if (filters.fuel_type) {
      const fuels = filters.fuel_type.split(',').map((f) => f.trim())
      if (fuels.length === 1) {
        query = query.eq('fuel_type', fuels[0])
      } else {
        query = query.in('fuel_type', fuels)
      }
    }

    if (filters.transmission) {
      const transmissions = filters.transmission
        .split(',')
        .map((t) => t.trim())
      if (transmissions.length === 1) {
        query = query.eq('transmission', transmissions[0])
      } else {
        query = query.in('transmission', transmissions)
      }
    }

    if (filters.price_min) {
      query = query.gte('price', Number(filters.price_min))
    }

    if (filters.price_max) {
      query = query.lte('price', Number(filters.price_max))
    }

    if (filters.year_min) {
      query = query.gte('year', Number(filters.year_min))
    }

    if (filters.year_max) {
      query = query.lte('year', Number(filters.year_max))
    }

    if (filters.km_min) {
      query = query.gte('mileage', Number(filters.km_min))
    }

    if (filters.km_max) {
      query = query.lte('mileage', Number(filters.km_max))
    }

    // ── Sorting ──────────────────────────────────────────────────────────

    switch (filters.sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price', { ascending: false })
        break
      case 'km_asc':
      case 'mileage_asc':
        query = query.order('mileage', { ascending: true })
        break
      case 'newest':
      case 'created_at_desc':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    // ── Pagination ───────────────────────────────────────────────────────

    const page = filters.page ? Number(filters.page) : 1
    const from = (page - 1) * ITEMS_PER_PAGE
    const to = from + ITEMS_PER_PAGE - 1

    query = query.range(from, to)

    // ── Execute ──────────────────────────────────────────────────────────

    const { data, count, error } = await Promise.race([
      query,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), QUERY_TIMEOUT)
      ),
    ])

    if (error) throw error

    const vehicles = (data ?? []).map((vehicle) => ({
      ...vehicle,
      images: vehicle.images?.sort(
        (a: { position: number }, b: { position: number }) =>
          a.position - b.position
      ),
    })) as Vehicle[]

    return { vehicles, count: count ?? 0 }
  } catch {
    // ── Fallback to mock data filtering ────────────────────────────────
    return getVehiclesMock(filters)
  }
}

// ─── Mock data filtering fallback ──────────────────────────────────────────

function getVehiclesMock(
  filters: Record<string, string | undefined>
): GetVehiclesResult {
  let filtered = mockVehicles.filter((v) => v.status === 'disponibile')

  if (filters.brand) {
    filtered = filtered.filter(
      (v) => v.brand.toLowerCase() === filters.brand!.toLowerCase()
    )
  }

  if (filters.model) {
    filtered = filtered.filter(
      (v) => v.model.toLowerCase() === filters.model!.toLowerCase()
    )
  }

  if (filters.fuel_type) {
    const fuels = filters.fuel_type
      .split(',')
      .map((f) => f.trim().toLowerCase())
    filtered = filtered.filter((v) => fuels.includes(v.fuel_type))
  }

  if (filters.transmission) {
    const transmissions = filters.transmission
      .split(',')
      .map((t) => t.trim().toLowerCase())
    filtered = filtered.filter((v) => transmissions.includes(v.transmission))
  }

  if (filters.price_min) {
    filtered = filtered.filter((v) => v.price >= Number(filters.price_min))
  }

  if (filters.price_max) {
    filtered = filtered.filter((v) => v.price <= Number(filters.price_max))
  }

  if (filters.year_min) {
    filtered = filtered.filter((v) => v.year >= Number(filters.year_min))
  }

  if (filters.year_max) {
    filtered = filtered.filter((v) => v.year <= Number(filters.year_max))
  }

  if (filters.km_min) {
    filtered = filtered.filter((v) => v.mileage >= Number(filters.km_min))
  }

  if (filters.km_max) {
    filtered = filtered.filter((v) => v.mileage <= Number(filters.km_max))
  }

  // Sorting
  switch (filters.sort) {
    case 'price_asc':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'km_asc':
    case 'mileage_asc':
      filtered.sort((a, b) => a.mileage - b.mileage)
      break
    case 'newest':
    case 'created_at_desc':
    default:
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      break
  }

  const count = filtered.length

  // Pagination
  const page = filters.page ? Number(filters.page) : 1
  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE

  return { vehicles: filtered.slice(from, to), count }
}

// ─── Get Single Vehicle by Slug (cached per request) ──────────────────────

export const getVehicleBySlug = cache(async function getVehicleBySlug(
  slug: string
): Promise<Vehicle | null> {
  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await Promise.race([
      supabase
        .from('vehicles')
        .select('*, images:vehicle_images(*)')
        .eq('slug', slug)
        .single(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), QUERY_TIMEOUT)
      ),
    ])

    if (error) throw error

    return {
      ...data,
      images: data.images?.sort(
        (a: { position: number }, b: { position: number }) =>
          a.position - b.position
      ),
    } as Vehicle
  } catch {
    return mockVehicles.find((v) => v.slug === slug) ?? null
  }
})

// ─── Get Similar Vehicles ──────────────────────────────────────────────────

export async function getSimilarVehicles(
  vehicle: Vehicle
): Promise<Vehicle[]> {
  try {
    const supabase = await createServerSupabaseClient()

    const priceMin = Math.round(vehicle.price * 0.8)
    const priceMax = Math.round(vehicle.price * 1.2)

    const { data, error } = await Promise.race([
      supabase
        .from('vehicles')
        .select('*, images:vehicle_images(*)')
        .eq('status', 'disponibile')
        .neq('id', vehicle.id)
        .or(
          `brand.eq.${vehicle.brand},and(price.gte.${priceMin},price.lte.${priceMax})`
        )
        .order('created_at', { ascending: false })
        .limit(4),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), QUERY_TIMEOUT)
      ),
    ])

    if (error) throw error

    return (data ?? []).map((v) => ({
      ...v,
      images: v.images?.sort(
        (a: { position: number }, b: { position: number }) =>
          a.position - b.position
      ),
    })) as Vehicle[]
  } catch {
    const priceMin = vehicle.price * 0.8
    const priceMax = vehicle.price * 1.2

    return mockVehicles
      .filter(
        (v) =>
          v.id !== vehicle.id &&
          v.status === 'disponibile' &&
          (v.brand === vehicle.brand ||
            (v.price >= priceMin && v.price <= priceMax))
      )
      .slice(0, 4)
  }
}

// ─── Get Distinct Brands ───────────────────────────────────────────────────

export async function getDistinctBrands(): Promise<string[]> {
  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await Promise.race([
      supabase
        .from('vehicles')
        .select('brand')
        .eq('status', 'disponibile')
        .order('brand'),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), QUERY_TIMEOUT)
      ),
    ])

    if (error) throw error

    return [...new Set((data ?? []).map((v) => v.brand))].sort()
  } catch {
    return [
      ...new Set(
        mockVehicles
          .filter((v) => v.status === 'disponibile')
          .map((v) => v.brand)
      ),
    ].sort()
  }
}

// ─── Get Models by Brand ───────────────────────────────────────────────────

export async function getModelsByBrand(brand: string): Promise<string[]> {
  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await Promise.race([
      supabase
        .from('vehicles')
        .select('model')
        .eq('status', 'disponibile')
        .ilike('brand', brand)
        .order('model'),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), QUERY_TIMEOUT)
      ),
    ])

    if (error) throw error

    return [...new Set((data ?? []).map((v) => v.model))].sort()
  } catch {
    return [
      ...new Set(
        mockVehicles
          .filter(
            (v) =>
              v.status === 'disponibile' &&
              v.brand.toLowerCase() === brand.toLowerCase()
          )
          .map((v) => v.model)
      ),
    ].sort()
  }
}

// ─── Get Vehicle Count ─────────────────────────────────────────────────────

export async function getVehicleCount(): Promise<number> {
  try {
    const supabase = await createServerSupabaseClient()

    const { count, error } = await Promise.race([
      supabase
        .from('vehicles')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'disponibile'),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), QUERY_TIMEOUT)
      ),
    ])

    if (error) throw error

    return count ?? 0
  } catch {
    return mockVehicles.filter((v) => v.status === 'disponibile').length
  }
}
