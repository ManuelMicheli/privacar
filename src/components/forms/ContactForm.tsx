'use client'

import { useState } from 'react'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { CheckCircle } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { submitContactRequest } from '@/lib/actions/contact-actions'
import type { RequestType } from '@/types'

const motivoOptions = [
  { value: 'generico', label: 'Info generali' },
  { value: 'info', label: 'Interessato a un\'auto' },
  { value: 'valutazione', label: 'Vendere la mia auto' },
  { value: 'finanziamento', label: 'Finanziamento' },
  { value: 'generico_altro', label: 'Altro' },
] as const

const contactFormSchema = z.object({
  name: z.string().min(1, 'Il nome è obbligatorio').max(100),
  email: z.string().min(1, 'L\'email è obbligatoria').email('Email non valida'),
  phone: z.string().max(20).optional().or(z.literal('')),
  motivo: z.string().min(1, 'Seleziona un motivo'),
  message: z.string().min(1, 'Il messaggio è obbligatorio').max(2000),
})

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})

    const form = new FormData(e.currentTarget)
    const formValues = {
      name: form.get('name') as string,
      email: form.get('email') as string,
      phone: form.get('phone') as string,
      motivo: form.get('motivo') as string,
      message: form.get('message') as string,
    }

    const parsed = contactFormSchema.safeParse(formValues)
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

    // Map motivo to request_type
    const requestType: RequestType =
      formValues.motivo === 'generico_altro' ? 'generico' : (formValues.motivo as RequestType)

    const result = await submitContactRequest({
      name: formValues.name,
      email: formValues.email,
      phone: formValues.phone,
      message: formValues.message,
      request_type: requestType,
    })

    setLoading(false)

    if (result.success) {
      setSuccess(true)
      toast.success('Messaggio inviato con successo!')
    } else {
      toast.error(result.error || 'Errore durante l\'invio.')
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
            Messaggio Inviato!
          </h3>
          <p className="text-text-secondary">
            Ti ricontatteremo il prima possibile. Grazie!
          </p>
          <Button
            variant="outline"
            onClick={() => setSuccess(false)}
          >
            Invia un altro messaggio
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="mb-6 font-heading text-2xl font-bold text-text-primary">
        Scrivici
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome */}
        <div>
          <label htmlFor="cf-name" className="mb-1 block text-sm font-medium text-text-primary">
            Nome *
          </label>
          <input
            id="cf-name"
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
          <label htmlFor="cf-email" className="mb-1 block text-sm font-medium text-text-primary">
            Email *
          </label>
          <input
            id="cf-email"
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
          <label htmlFor="cf-phone" className="mb-1 block text-sm font-medium text-text-primary">
            Telefono
          </label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            className={inputClasses}
            placeholder="Il tuo numero di telefono"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        {/* Motivo */}
        <div>
          <label htmlFor="cf-motivo" className="mb-1 block text-sm font-medium text-text-primary">
            Motivo *
          </label>
          <select
            id="cf-motivo"
            name="motivo"
            required
            defaultValue=""
            className={inputClasses}
          >
            <option value="" disabled>
              Seleziona un motivo
            </option>
            {motivoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.motivo && <p className="mt-1 text-xs text-red-600">{errors.motivo}</p>}
        </div>

        {/* Messaggio */}
        <div>
          <label htmlFor="cf-message" className="mb-1 block text-sm font-medium text-text-primary">
            Messaggio *
          </label>
          <textarea
            id="cf-message"
            name="message"
            rows={4}
            required
            className={`${inputClasses} resize-none`}
            placeholder="Scrivi qui il tuo messaggio..."
          />
          {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
        </div>

        <Button type="submit" variant="primary" className="w-full" loading={loading}>
          Invia Messaggio
        </Button>
      </form>
    </div>
  )
}
