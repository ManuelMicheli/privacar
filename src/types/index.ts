// ─── Type Unions ──────────────────────────────────────────────────────────────

export type FuelType =
  | 'benzina'
  | 'diesel'
  | 'gpl'
  | 'metano'
  | 'ibrida'
  | 'elettrica'

export type TransmissionType = 'manuale' | 'automatico'

export type VehicleStatus = 'disponibile' | 'riservata' | 'venduta'

export type RequestType =
  | 'info'
  | 'finanziamento'
  | 'garanzia'
  | 'valutazione'
  | 'generico'

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'

// ─── Vehicle Features (JSONB shape) ──────────────────────────────────────────

export interface VehicleFeatures {
  comfort?: string[]
  sicurezza?: string[]
  infotainment?: string[]
  altro?: string[]
}

// ─── Core Entities ───────────────────────────────────────────────────────────

export interface Vehicle {
  id: string
  slug: string
  brand: string
  model: string
  version: string | null
  year: number
  mileage: number
  fuel_type: FuelType
  transmission: TransmissionType
  power_hp: number | null
  power_kw: number | null
  engine_cc: number | null
  body_type: string | null
  color_exterior: string | null
  color_interior: string | null
  doors: number | null
  seats: number | null
  emission_class: string | null
  drive_type: string | null
  new_driver_ok: boolean
  price: number
  monthly_payment: number | null
  description: string | null
  features: VehicleFeatures
  is_featured: boolean
  status: VehicleStatus
  created_at: string
  updated_at: string
  images?: VehicleImage[]
}

export interface VehicleImage {
  id: string
  vehicle_id: string
  url: string
  position: number
  is_cover: boolean
  created_at: string
}

export interface ContactRequest {
  id: string
  vehicle_id: string | null
  name: string
  email: string
  phone: string | null
  message: string | null
  request_type: RequestType
  is_read: boolean
  created_at: string
  vehicle?: Vehicle | null
}

export interface Appointment {
  id: string
  vehicle_id: string | null
  name: string
  email: string
  phone: string
  preferred_date: string
  preferred_time: 'mattina' | 'pomeriggio'
  notes: string | null
  status: AppointmentStatus
  created_at: string
  vehicle?: Vehicle | null
}

export interface SiteSetting {
  id: string
  key: string
  value: Record<string, unknown>
  updated_at: string
}

// ─── Filter / Query Params ───────────────────────────────────────────────────

export interface VehicleFilters {
  brand?: string
  model?: string
  fuel_type?: FuelType
  transmission?: TransmissionType
  price_min?: number
  price_max?: number
  year_min?: number
  year_max?: number
  km_min?: number
  km_max?: number
  sort?: string
  page?: number
}
