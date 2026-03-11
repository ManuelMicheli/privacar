'use client'

import { useState, useCallback, useMemo } from 'react'
import { CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { appointmentSchema } from '@/lib/schemas/appointment'
import { submitAppointment } from '@/lib/actions/appointment-actions'

export interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  vehicleId?: string
  vehicleName?: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  preferred_date?: string
  preferred_time?: string
  notes?: string
  form?: string
}

export function AppointmentModal({
  isOpen,
  onClose,
  vehicleId,
  vehicleName,
}: AppointmentModalProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  // Tomorrow's date as minimum
  const minDate = useMemo(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setErrors({})

      const form = e.currentTarget
      const formData = new FormData(form)

      const formValues = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        preferred_date: formData.get('preferred_date') as string,
        preferred_time: formData.get('preferred_time') as string,
        notes: (formData.get('notes') as string) || '',
        vehicle_id: vehicleId || '',
      }

      // Client-side validation
      const parsed = appointmentSchema.safeParse(formValues)
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
        const result = await submitAppointment(formValues)

        if (result.success) {
          setSuccess(true)
          toast.success('Appuntamento prenotato con successo!')
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
    [vehicleId]
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
      title="Prenota un Appuntamento"
      size="md"
    >
      {success ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h3 className="font-heading text-lg font-bold text-text-primary">
            Appuntamento Prenotato!
          </h3>
          <p className="text-sm text-text-secondary">
            Ti contatteremo per confermare il tuo appuntamento. Grazie!
          </p>
          <Button variant="primary" onClick={handleClose}>
            Chiudi
          </Button>
        </div>
      ) : (
        <>
          {vehicleName && (
            <p className="mb-4 rounded-lg bg-bg-alt px-4 py-2.5 text-sm text-text-secondary">
              Appuntamento per:{' '}
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
                htmlFor="appointment-name"
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                Nome <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="appointment-name"
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
                htmlFor="appointment-email"
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="appointment-email"
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
                htmlFor="appointment-phone"
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                Telefono <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                id="appointment-phone"
                name="phone"
                required
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

            {/* Data preferita e Fascia oraria */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Data */}
              <div>
                <label
                  htmlFor="appointment-date"
                  className="mb-1.5 block text-sm font-medium text-text-primary"
                >
                  Data preferita <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  id="appointment-date"
                  name="preferred_date"
                  required
                  min={minDate}
                  className={cn(
                    'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-text-primary transition-colors focus:border-[#065F46] focus:outline-none focus:ring-2 focus:ring-[#065F46]/10',
                    errors.preferred_date
                      ? 'border-red-500'
                      : 'border-border'
                  )}
                />
                {errors.preferred_date && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.preferred_date}
                  </p>
                )}
              </div>

              {/* Fascia oraria */}
              <div>
                <label
                  htmlFor="appointment-time"
                  className="mb-1.5 block text-sm font-medium text-text-primary"
                >
                  Fascia oraria <span className="text-red-600">*</span>
                </label>
                <select
                  id="appointment-time"
                  name="preferred_time"
                  required
                  defaultValue=""
                  className={cn(
                    'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-text-primary transition-colors focus:border-[#065F46] focus:outline-none focus:ring-2 focus:ring-[#065F46]/10',
                    errors.preferred_time
                      ? 'border-red-500'
                      : 'border-border'
                  )}
                >
                  <option value="" disabled>
                    Seleziona...
                  </option>
                  <option value="mattina">Mattina (9:00 - 12:30)</option>
                  <option value="pomeriggio">Pomeriggio (15:00 - 19:00)</option>
                </select>
                {errors.preferred_time && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.preferred_time}
                  </p>
                )}
              </div>
            </div>

            {/* Note */}
            <div>
              <label
                htmlFor="appointment-notes"
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                Note
              </label>
              <textarea
                id="appointment-notes"
                name="notes"
                rows={3}
                className={cn(
                  'w-full resize-none rounded-xl border bg-white px-4 py-2.5 text-sm text-text-primary transition-colors placeholder:text-[#8A9A90] focus:border-[#065F46] focus:outline-none focus:ring-2 focus:ring-[#065F46]/10',
                  errors.notes ? 'border-red-500' : 'border-border'
                )}
                placeholder="Eventuali note o richieste particolari..."
              />
              {errors.notes && (
                <p className="mt-1 text-xs text-red-600">{errors.notes}</p>
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
                {loading ? 'Invio...' : 'Prenota Appuntamento'}
              </Button>
            </div>
          </form>
        </>
      )}
    </Modal>
  )
}
