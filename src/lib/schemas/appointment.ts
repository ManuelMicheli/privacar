import { z } from 'zod'

/**
 * Returns true if the given date string (YYYY-MM-DD) falls on a Sunday.
 */
function isSunday(dateStr: string): boolean {
  const date = new Date(dateStr + 'T00:00:00')
  return date.getDay() === 0
}

/**
 * Returns true if the given date string (YYYY-MM-DD) is in the past
 * (before today).
 */
function isPastDate(dateStr: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(dateStr + 'T00:00:00')
  return date < today
}

export const appointmentSchema = z.object({
  name: z
    .string({ required_error: 'Il nome è obbligatorio' })
    .min(1, 'Il nome è obbligatorio')
    .max(100, 'Il nome è troppo lungo'),
  email: z
    .string({ required_error: "L'email è obbligatoria" })
    .min(1, "L'email è obbligatoria")
    .email('Inserisci un indirizzo email valido'),
  phone: z
    .string({ required_error: 'Il telefono è obbligatorio' })
    .min(1, 'Il telefono è obbligatorio')
    .max(20, 'Numero di telefono troppo lungo'),
  preferred_date: z
    .string({ required_error: 'La data è obbligatoria' })
    .min(1, 'La data è obbligatoria')
    .refine((val) => !isPastDate(val), {
      message: 'Non è possibile selezionare una data passata',
    })
    .refine((val) => !isSunday(val), {
      message: 'Non è possibile prenotare di domenica',
    }),
  preferred_time: z.enum(['mattina', 'pomeriggio'], {
    required_error: "L'orario preferito è obbligatorio",
  }),
  notes: z
    .string()
    .max(1000, 'Le note sono troppo lunghe')
    .optional()
    .or(z.literal('')),
  vehicle_id: z.string().uuid('ID veicolo non valido').optional().or(z.literal('')),
})

export type AppointmentFormValues = z.infer<typeof appointmentSchema>
