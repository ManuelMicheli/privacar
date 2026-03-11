import { z } from 'zod'

// ─── Vehicle Form Schema (create / edit) ─────────────────────────────────────

export const vehicleSchema = z.object({
  brand: z.string().min(1, 'La marca è obbligatoria'),
  model: z.string().min(1, 'Il modello è obbligatorio'),
  version: z.string().optional().nullable(),
  year: z
    .number({ required_error: "L'anno è obbligatorio" })
    .int()
    .min(1990, 'Anno non valido')
    .max(new Date().getFullYear() + 1, 'Anno non valido'),
  mileage: z
    .number({ required_error: 'Il chilometraggio è obbligatorio' })
    .int()
    .min(0, 'Chilometraggio non valido'),
  fuel_type: z.enum(
    ['benzina', 'diesel', 'gpl', 'metano', 'ibrida', 'elettrica'],
    { required_error: "L'alimentazione è obbligatoria" }
  ),
  transmission: z.enum(['manuale', 'automatico'], {
    required_error: 'Il cambio è obbligatorio',
  }),
  power_hp: z.number().int().positive('Potenza non valida').optional().nullable(),
  power_kw: z.number().int().positive('Potenza non valida').optional().nullable(),
  engine_cc: z
    .number()
    .int()
    .positive('Cilindrata non valida')
    .optional()
    .nullable(),
  body_type: z.string().optional().nullable(),
  color_exterior: z.string().optional().nullable(),
  color_interior: z.string().optional().nullable(),
  doors: z.number().int().min(2).max(5).optional().nullable(),
  seats: z.number().int().min(1).max(9).optional().nullable(),
  emission_class: z.string().optional().nullable(),
  drive_type: z.string().optional().nullable(),
  new_driver_ok: z.boolean().default(false),
  price: z
    .number({ required_error: 'Il prezzo è obbligatorio' })
    .positive('Il prezzo deve essere maggiore di 0'),
  monthly_payment: z.number().positive().optional().nullable(),
  description: z.string().optional().nullable(),
  features: z
    .object({
      comfort: z.array(z.string()).optional(),
      sicurezza: z.array(z.string()).optional(),
      infotainment: z.array(z.string()).optional(),
      altro: z.array(z.string()).optional(),
    })
    .default({}),
  is_featured: z.boolean().default(false),
  status: z
    .enum(['disponibile', 'riservata', 'venduta'])
    .default('disponibile'),
})

export type VehicleFormValues = z.infer<typeof vehicleSchema>

// ─── Vehicle Filter Schema (URL search params) ──────────────────────────────

export const vehicleFilterSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  fuel_type: z
    .enum(['benzina', 'diesel', 'gpl', 'metano', 'ibrida', 'elettrica'])
    .optional(),
  transmission: z.enum(['manuale', 'automatico']).optional(),
  price_min: z.coerce.number().positive().optional(),
  price_max: z.coerce.number().positive().optional(),
  year_min: z.coerce.number().int().min(1990).optional(),
  year_max: z.coerce
    .number()
    .int()
    .max(new Date().getFullYear() + 1)
    .optional(),
  km_min: z.coerce.number().int().min(0).optional(),
  km_max: z.coerce.number().int().min(0).optional(),
  sort: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
})

export type VehicleFilterValues = z.infer<typeof vehicleFilterSchema>
