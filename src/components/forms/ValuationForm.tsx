'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { CheckCircle } from '@/components/icons'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { BRANDS } from '@/lib/utils/constants'
import { submitContactRequest } from '@/lib/actions/contact-actions'

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 2004 }, (_, i) => currentYear - i)

const valuationSchema = z.object({
  brand: z.string().min(1, 'Seleziona la marca'),
  model: z.string().min(1, 'Inserisci il modello'),
  year: z.string().min(1, 'Seleziona l\'anno'),
  km: z.string().min(1, 'Inserisci i chilometri'),
  name: z.string().min(1, 'Il nome è obbligatorio').max(100, 'Nome troppo lungo'),
  phone: z.string().min(1, 'Il telefono è obbligatorio').max(20, 'Numero troppo lungo'),
  email: z.string().min(1, 'L\'email è obbligatoria').email('Email non valida'),
})

type ValuationFormValues = z.infer<typeof valuationSchema>

export function ValuationForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})

    const form = new FormData(e.currentTarget)
    const formValues: ValuationFormValues = {
      brand: form.get('brand') as string,
      model: form.get('model') as string,
      year: form.get('year') as string,
      km: form.get('km') as string,
      name: form.get('name') as string,
      phone: form.get('phone') as string,
      email: form.get('email') as string,
    }

    const parsed = valuationSchema.safeParse(formValues)
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

    const message = `Valutazione auto: ${formValues.brand} ${formValues.model}, Anno ${formValues.year}, ${formValues.km} km. Telefono: ${formValues.phone}`

    const result = await submitContactRequest({
      name: formValues.name,
      email: formValues.email,
      phone: formValues.phone,
      message,
      request_type: 'valutazione',
    })

    setLoading(false)

    if (result.success) {
      setSuccess(true)
    } else {
      setErrors({ form: result.error || 'Errore durante l\'invio.' })
    }
  }

  const inputClasses =
    'w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text-primary transition-colors focus:border-[#065F46] focus:outline-none focus:ring-2 focus:ring-[#065F46]/10'

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 py-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10"
            >
              <CheckCircle className="h-8 w-8 text-success" />
            </motion.div>
            <h3 className="font-heading text-2xl font-bold text-text-primary">
              Grazie!
            </h3>
            <p className="text-text-secondary">
              Ti ricontatteremo entro 24 ore con la valutazione della tua auto.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="mb-6 font-heading text-3xl font-bold text-text-primary">
              Valutazione Rapida Gratuita
            </h3>

            {errors.form && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Brand */}
              <div>
                <label htmlFor="val-brand" className="mb-1 block text-sm font-medium text-text-primary">
                  Marca *
                </label>
                <select
                  id="val-brand"
                  name="brand"
                  required
                  defaultValue=""
                  className={inputClasses}
                >
                  <option value="" disabled>
                    Seleziona la marca
                  </option>
                  {BRANDS.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
                {errors.brand && <p className="mt-1 text-xs text-red-600">{errors.brand}</p>}
              </div>

              {/* Model */}
              <div>
                <label htmlFor="val-model" className="mb-1 block text-sm font-medium text-text-primary">
                  Modello *
                </label>
                <input
                  id="val-model"
                  name="model"
                  type="text"
                  required
                  className={inputClasses}
                  placeholder="es. Golf, Panda, 500..."
                />
                {errors.model && <p className="mt-1 text-xs text-red-600">{errors.model}</p>}
              </div>

              {/* Year & Km row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="val-year" className="mb-1 block text-sm font-medium text-text-primary">
                    Anno *
                  </label>
                  <select
                    id="val-year"
                    name="year"
                    required
                    defaultValue=""
                    className={inputClasses}
                  >
                    <option value="" disabled>
                      Anno
                    </option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.year && <p className="mt-1 text-xs text-red-600">{errors.year}</p>}
                </div>

                <div>
                  <label htmlFor="val-km" className="mb-1 block text-sm font-medium text-text-primary">
                    Km *
                  </label>
                  <input
                    id="val-km"
                    name="km"
                    type="number"
                    required
                    min={0}
                    className={inputClasses}
                    placeholder="es. 85000"
                  />
                  {errors.km && <p className="mt-1 text-xs text-red-600">{errors.km}</p>}
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="val-name" className="mb-1 block text-sm font-medium text-text-primary">
                  Nome *
                </label>
                <input
                  id="val-name"
                  name="name"
                  type="text"
                  required
                  className={inputClasses}
                  placeholder="Il tuo nome"
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="val-phone" className="mb-1 block text-sm font-medium text-text-primary">
                  Telefono *
                </label>
                <input
                  id="val-phone"
                  name="phone"
                  type="tel"
                  required
                  className={inputClasses}
                  placeholder="+39 ..."
                />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="val-email" className="mb-1 block text-sm font-medium text-text-primary">
                  Email *
                </label>
                <input
                  id="val-email"
                  name="email"
                  type="email"
                  required
                  className={inputClasses}
                  placeholder="La tua email"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              <Button type="submit" variant="primary" className="w-full" loading={loading}>
                Richiedi Valutazione Gratuita
              </Button>

              <p className="text-center text-xs text-text-muted">
                I tuoi dati verranno trattati nel rispetto della privacy.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
