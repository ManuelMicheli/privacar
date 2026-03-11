'use client'

import { useState } from 'react'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { CheckCircle } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { submitAppointment } from '@/lib/actions/appointment-actions'

function isSunday(dateStr: string): boolean {
  const date = new Date(dateStr + 'T00:00:00')
  return date.getDay() === 0
}

function isPastDate(dateStr: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(dateStr + 'T00:00:00')
  return date <= today
}

const appointmentFormSchema = z.object({
  name: z.string().min(1, 'Il nome è obbligatorio').max(100),
  email: z.string().min(1, 'L\'email è obbligatoria').email('Email non valida'),
  phone: z.string().min(1, 'Il telefono è obbligatorio').max(20),
  preferred_date: z
    .string()
    .min(1, 'La data è obbligatoria')
    .refine((val) => !isPastDate(val), 'Seleziona una data futura')
    .refine((val) => !isSunday(val), 'Non è possibile prenotare di domenica'),
  preferred_time: z.enum(['mattina', 'pomeriggio'], {
    required_error: 'Seleziona una fascia oraria',
  }),
  notes: z.string().max(1000).optional().or(z.literal('')),
})

export function AppointmentForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Tomorrow's date as minimum
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})

    const form = new FormData(e.currentTarget)
    const formValues = {
      name: form.get('name') as string,
      email: form.get('email') as string,
      phone: form.get('phone') as string,
      preferred_date: form.get('preferred_date') as string,
      preferred_time: form.get('preferred_time') as string,
      notes: form.get('notes') as string,
    }

    const parsed = appointmentFormSchema.safeParse(formValues)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)

    const result = await submitAppointment({
      name: formValues.name,
      email: formValues.email,
      phone: formValues.phone,
      preferred_date: formValues.preferred_date,
      preferred_time: formValues.preferred_time as 'mattina' | 'pomeriggio',
      notes: formValues.notes,
    })

    setLoading(false)

    if (result.success) {
      setSuccess(true)
      toast.success('Appuntamento prenotato con successo!')
    } else {
      toast.error(result.error || 'Errore durante la prenotazione.')
    }
  }

  const inputClasses =
    'w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text-primary transition-colors focus:border-[#065F46] focus:outline-none focus:ring-2 focus:ring-[#065F46]/10'

  if (success) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-text-primary">
            Appuntamento Prenotato!
          </h3>
          <p className="text-text-secondary">
            Riceverai una conferma via email. Ti aspettiamo!
          </p>
          <Button
            variant="outline"
            onClick={() => setSuccess(false)}
          >
            Prenota un altro appuntamento
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="mb-6 font-heading text-2xl font-bold text-text-primary">
        Prenota un Appuntamento
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome */}
        <div>
          <label htmlFor="af-name" className="mb-1 block text-sm font-medium text-text-primary">
            Nome *
          </label>
          <input
            id="af-name"
            name="name"
            type="text"
            required
            className={inputClasses}
            placeholder="Il tuo nome"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="af-email" className="mb-1 block text-sm font-medium text-text-primary">
            Email *
          </label>
          <input
            id="af-email"
            name="email"
            type="email"
            required
            className={inputClasses}
            placeholder="La tua email"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        {/* Telefono */}
        <div>
          <label htmlFor="af-phone" className="mb-1 block text-sm font-medium text-text-primary">
            Telefono *
          </label>
          <input
            id="af-phone"
            name="phone"
            type="tel"
            required
            className={inputClasses}
            placeholder="+39 ..."
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        {/* Data & Fascia oraria */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="af-date" className="mb-1 block text-sm font-medium text-text-primary">
              Data preferita *
            </label>
            <input
              id="af-date"
              name="preferred_date"
              type="date"
              required
              min={minDate}
              className={inputClasses}
            />
            {errors.preferred_date && (
              <p className="mt-1 text-xs text-red-600">{errors.preferred_date}</p>
            )}
          </div>

          <div>
            <label htmlFor="af-time" className="mb-1 block text-sm font-medium text-text-primary">
              Fascia oraria *
            </label>
            <select
              id="af-time"
              name="preferred_time"
              required
              defaultValue=""
              className={inputClasses}
            >
              <option value="" disabled>
                Seleziona
              </option>
              <option value="mattina">Mattina</option>
              <option value="pomeriggio">Pomeriggio</option>
            </select>
            {errors.preferred_time && (
              <p className="mt-1 text-xs text-red-600">{errors.preferred_time}</p>
            )}
          </div>
        </div>

        {/* Note */}
        <div>
          <label htmlFor="af-notes" className="mb-1 block text-sm font-medium text-text-primary">
            Note <span className="text-text-muted">(opzionale)</span>
          </label>
          <textarea
            id="af-notes"
            name="notes"
            rows={3}
            className={`${inputClasses} resize-none`}
            placeholder="Eventuali richieste o informazioni aggiuntive..."
          />
          {errors.notes && <p className="mt-1 text-xs text-red-600">{errors.notes}</p>}
        </div>

        <Button type="submit" variant="primary" className="w-full" loading={loading}>
          Prenota Appuntamento
        </Button>

        <p className="text-center text-xs text-text-muted">
          Ti confermeremo l&apos;appuntamento via email entro 24 ore.
        </p>
      </form>
    </div>
  )
}
