import { z } from 'zod'

export const contactRequestSchema = z.object({
  name: z
    .string({ required_error: 'Il nome è obbligatorio' })
    .min(1, 'Il nome è obbligatorio')
    .max(100, 'Il nome è troppo lungo'),
  email: z
    .string({ required_error: "L'email è obbligatoria" })
    .min(1, "L'email è obbligatoria")
    .email('Inserisci un indirizzo email valido'),
  phone: z
    .string()
    .max(20, 'Numero di telefono troppo lungo')
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .max(2000, 'Il messaggio è troppo lungo')
    .optional()
    .or(z.literal('')),
  request_type: z.enum(
    ['info', 'finanziamento', 'garanzia', 'valutazione', 'generico'],
    { required_error: 'Il tipo di richiesta è obbligatorio' }
  ),
  vehicle_id: z.string().uuid('ID veicolo non valido').optional().or(z.literal('')),
})

export type ContactRequestFormValues = z.infer<typeof contactRequestSchema>
