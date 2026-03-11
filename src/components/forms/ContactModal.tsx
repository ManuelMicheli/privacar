'use client'

import { useState, useCallback } from 'react'
import { CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { contactRequestSchema } from '@/lib/schemas/contact'
import { submitContactRequest } from '@/lib/actions/contact-actions'
import type { RequestType } from '@/types'

export interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  vehicleId?: string
  vehicleName?: string
  requestType?: RequestType
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  message?: string
  form?: string
}

export function ContactModal({
  isOpen,
  onClose,
  vehicleId,
  vehicleName,
  requestType = 'info',
}: ContactModalProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const titleMap: Record<RequestType, string> = {
    info: 'Richiedi Informazioni',
    finanziamento: 'Richiedi Simulazione Finanziamento',
    garanzia: 'Scopri la Copertura Garanzia',
    valutazione: 'Richiedi Valutazione',
    generico: 'Contattaci',
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setErrors({})

      const form = e.currentTarget
      const formData = new FormData(form)

      const formValues = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: (formData.get('phone') as string) || '',
        message: (formData.get('message') as string) || '',
        request_type: requestType,
        vehicle_id: vehicleId || '',
      }

      // Client-side validation
      const parsed = contactRequestSchema.safeParse(formValues)
      if (!parsed.success) {
        const fieldErrors: FormErrors = {}
        parsed.error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof FormErrors] = err.message
          }
        })
        setErrors(fieldErrors)
        return
      }

      setLoading(true)

      try {
        const result = await submitContactRequest(formValues)

        if (result.success) {
          setSuccess(true)
          toast.success('Richiesta inviata con successo!')
        } else {
          setErrors({
            form: result.error || "Errore durante l'invio.",
          })
        }
      } catch {
        setErrors({ form: "Errore durante l'invio. Riprova piu' tardi." })
      } finally {
        setLoading(false)
      }
    },
    [requestType, vehicleId]
  )

  function handleClose() {
    setSuccess(false)
    setErrors({})
    setLoading(false)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        vehicleName
          ? `${titleMap[requestType]}`
          : titleMap[requestType]
      }
      size="md"
    >
      {success ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h3 className="font-heading text-lg font-bold text-text-primary">
            Messaggio Inviato!
          </h3>
          <p className="text-sm text-text-secondary">
            Ti ricontatteremo entro 24 ore. Grazie per averci contattato!
          </p>
          <Button variant="primary" onClick={handleClose}>
            Chiudi
          </Button>
        </div>
      ) : (
        <>
          {vehicleName && (
            <p className="mb-4 rounded-lg bg-bg-alt px-4 py-2.5 text-sm text-text-secondary">
              Richiesta per:{' '}
              <span className="font-semibold text-text-primary">
                {vehicleName}
              </span>
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {errors.form && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {errors.form}
              </div>
            )}

            {/* Nome */}
            <div>
              <label
                htmlFor="contact-name"
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                Nome <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="contact-name"
                name="name"
                required
                autoComplete="name"
                className={cn(
                  'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-text-primary transition-colors placeholder:text-[#8A9A90] focus:border-[#065F46] focus:outline-none focus:ring-2 focus:ring-[#065F46]/10',
                  errors.name ? 'border-red-500' : 'border-border'
                )}
                placeholder="Il tuo nome"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="contact-email"
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                required
                autoComplete="email"
                className={cn(
                  'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-text-primary transition-colors placeholder:text-[#8A9A90] focus:border-[#065F46] focus:outline-none focus:ring-2 focus:ring-[#065F46]/10',
                  errors.email ? 'border-red-500' : 'border-border'
                )}
                placeholder="la-tua@email.it"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Telefono */}
            <div>
              <label
                htmlFor="contact-phone"
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                Telefono
              </label>
              <input
                type="tel"
                id="contact-phone"
                name="phone"
                autoComplete="tel"
                className={cn(
                  'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-text-primary transition-colors placeholder:text-[#8A9A90] focus:border-[#065F46] focus:outline-none focus:ring-2 focus:ring-[#065F46]/10',
                  errors.phone ? 'border-red-500' : 'border-border'
                )}
                placeholder="Il tuo numero di telefono"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Messaggio */}
            <div>
              <label
                htmlFor="contact-message"
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                Messaggio <span className="text-red-600">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                className={cn(
                  'w-full resize-none rounded-xl border bg-white px-4 py-2.5 text-sm text-text-primary transition-colors placeholder:text-[#8A9A90] focus:border-[#065F46] focus:outline-none focus:ring-2 focus:ring-[#065F46]/10',
                  errors.message ? 'border-red-500' : 'border-border'
                )}
                placeholder="Scrivi il tuo messaggio..."
                defaultValue={
                  vehicleName
                    ? `Salve, sono interessato/a al veicolo ${vehicleName}. Vorrei ricevere maggiori informazioni.`
                    : ''
                }
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-600">{errors.message}</p>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                Annulla
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Invio...' : 'Invia Richiesta'}
              </Button>
            </div>
          </form>
        </>
      )}
    </Modal>
  )
}
