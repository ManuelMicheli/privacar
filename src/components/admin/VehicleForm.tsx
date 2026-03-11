'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { vehicleSchema } from '@/lib/schemas/vehicle'
import { generateSlug } from '@/lib/utils/slug'
import {
  BRANDS,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  BODY_TYPES,
  EMISSION_CLASSES,
} from '@/lib/utils/constants'
import {
  createVehicle,
  updateVehicle,
  uploadVehicleImage,
} from '@/lib/actions/vehicle-actions'
import { FeaturesEditor } from '@/components/admin/FeaturesEditor'
import {
  ImageUploader,
  type LocalImage,
} from '@/components/admin/ImageUploader'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { Save, Loader2 } from 'lucide-react'
import type { Vehicle, VehicleFeatures } from '@/types'
import toast from 'react-hot-toast'

// ─── Helper to convert File to base64 ───────────────────────────────────────

function fileToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = () => {
      const maxWidth = 1920
      let { width, height } = img

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      if (!ctx) {
        reject(new Error('Canvas context not available'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Failed to compress image'))
        },
        'image/jpeg',
        0.85
      )
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

// ─── Drive types ────────────────────────────────────────────────────────────

const DRIVE_TYPES = [
  'Trazione anteriore',
  'Trazione posteriore',
  'Integrale',
] as const

// ─── Props ──────────────────────────────────────────────────────────────────

interface VehicleFormProps {
  vehicle?: Vehicle
}

// ─── Component ──────────────────────────────────────────────────────────────

export function VehicleForm({ vehicle }: VehicleFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEdit = !!vehicle

  // ── Form state ──────────────────────────────────────────────────────────

  const [brand, setBrand] = useState(vehicle?.brand ?? '')
  const [model, setModel] = useState(vehicle?.model ?? '')
  const [version, setVersion] = useState(vehicle?.version ?? '')
  const [year, setYear] = useState(vehicle?.year ?? new Date().getFullYear())
  const [mileage, setMileage] = useState(vehicle?.mileage ?? 0)
  const [slug, setSlug] = useState(vehicle?.slug ?? '')
  const [slugManual, setSlugManual] = useState(false)

  const [fuelType, setFuelType] = useState(vehicle?.fuel_type ?? 'benzina')
  const [transmission, setTransmission] = useState(
    vehicle?.transmission ?? 'manuale'
  )
  const [powerHp, setPowerHp] = useState<string>(
    vehicle?.power_hp?.toString() ?? ''
  )
  const [powerKw, setPowerKw] = useState<string>(
    vehicle?.power_kw?.toString() ?? ''
  )
  const [engineCc, setEngineCc] = useState<string>(
    vehicle?.engine_cc?.toString() ?? ''
  )
  const [bodyType, setBodyType] = useState(vehicle?.body_type ?? '')
  const [doors, setDoors] = useState<string>(
    vehicle?.doors?.toString() ?? ''
  )
  const [seats, setSeats] = useState<string>(
    vehicle?.seats?.toString() ?? ''
  )
  const [emissionClass, setEmissionClass] = useState(
    vehicle?.emission_class ?? ''
  )
  const [driveType, setDriveType] = useState(vehicle?.drive_type ?? '')
  const [newDriverOk, setNewDriverOk] = useState(
    vehicle?.new_driver_ok ?? false
  )
  const [colorExterior, setColorExterior] = useState(
    vehicle?.color_exterior ?? ''
  )
  const [colorInterior, setColorInterior] = useState(
    vehicle?.color_interior ?? ''
  )

  const [price, setPrice] = useState<string>(
    vehicle?.price?.toString() ?? ''
  )
  const [monthlyPayment, setMonthlyPayment] = useState<string>(
    vehicle?.monthly_payment?.toString() ?? ''
  )

  const [description, setDescription] = useState(vehicle?.description ?? '')

  const [features, setFeatures] = useState<VehicleFeatures>(
    vehicle?.features ?? {}
  )

  const [localImages, setLocalImages] = useState<LocalImage[]>([])

  const [status, setStatus] = useState(vehicle?.status ?? 'disponibile')
  const [isFeatured, setIsFeatured] = useState(vehicle?.is_featured ?? false)

  const [errors, setErrors] = useState<Record<string, string>>({})

  // ── Auto-generate slug ────────────────────────────────────────────────

  useEffect(() => {
    if (slugManual) return
    if (brand && model) {
      setSlug(
        generateSlug(brand, model, version || null, year)
      )
    }
  }, [brand, model, version, year, slugManual])

  // ── Auto-calc monthly payment ─────────────────────────────────────────

  useEffect(() => {
    if (price && !monthlyPayment) {
      const p = Number(price)
      if (p > 0) {
        setMonthlyPayment(Math.round(p / 48).toString())
      }
    }
    // Only auto-calc when price changes, not when monthlyPayment changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price])

  // ── Submit ────────────────────────────────────────────────────────────

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    // Build data object for validation
    const data = {
      brand,
      model,
      version: version || null,
      year,
      mileage,
      fuel_type: fuelType,
      transmission,
      power_hp: powerHp ? Number(powerHp) : null,
      power_kw: powerKw ? Number(powerKw) : null,
      engine_cc: engineCc ? Number(engineCc) : null,
      body_type: bodyType || null,
      color_exterior: colorExterior || null,
      color_interior: colorInterior || null,
      doors: doors ? Number(doors) : null,
      seats: seats ? Number(seats) : null,
      emission_class: emissionClass || null,
      drive_type: driveType || null,
      new_driver_ok: newDriverOk,
      price: price ? Number(price) : 0,
      monthly_payment: monthlyPayment ? Number(monthlyPayment) : null,
      description: description || null,
      features,
      is_featured: isFeatured,
      status,
    }

    // Validate with Zod
    const parsed = vehicleSchema.safeParse(data)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const error of parsed.error.errors) {
        const field = error.path.join('.')
        fieldErrors[field] = error.message
      }
      setErrors(fieldErrors)
      toast.error('Verifica i campi evidenziati')
      return
    }

    // Build FormData
    const formData = new FormData()
    formData.set('brand', brand)
    formData.set('model', model)
    formData.set('version', version)
    formData.set('year', year.toString())
    formData.set('mileage', mileage.toString())
    formData.set('slug', slug)
    formData.set('fuel_type', fuelType)
    formData.set('transmission', transmission)
    formData.set('power_hp', powerHp)
    formData.set('power_kw', powerKw)
    formData.set('engine_cc', engineCc)
    formData.set('body_type', bodyType)
    formData.set('color_exterior', colorExterior)
    formData.set('color_interior', colorInterior)
    formData.set('doors', doors)
    formData.set('seats', seats)
    formData.set('emission_class', emissionClass)
    formData.set('drive_type', driveType)
    formData.set('new_driver_ok', newDriverOk.toString())
    formData.set('price', price)
    formData.set('monthly_payment', monthlyPayment)
    formData.set('description', description)
    formData.set('features', JSON.stringify(features))
    formData.set('is_featured', isFeatured.toString())
    formData.set('status', status)

    startTransition(async () => {
      try {
        let result: { success: boolean; error?: string; id?: string }

        if (isEdit) {
          result = await updateVehicle(vehicle.id, formData)
        } else {
          result = await createVehicle(formData)
        }

        if (!result.success) {
          toast.error(result.error ?? 'Errore durante il salvataggio')
          return
        }

        // If create mode and there are local images, upload them
        if (!isEdit && result.id && localImages.length > 0) {
          const vehicleId = result.id
          for (let i = 0; i < localImages.length; i++) {
            const img = localImages[i]
            try {
              const compressed = await compressImage(img.file)
              const base64 = await fileToBase64(compressed)
              await uploadVehicleImage(
                vehicleId,
                base64,
                img.file.name,
                'image/jpeg',
                i,
                img.is_cover
              )
            } catch {
              console.error(`Failed to upload image ${i}`)
            }
          }
        }

        toast.success(
          isEdit
            ? 'Veicolo aggiornato con successo'
            : 'Veicolo creato con successo'
        )
        router.push('/admin/veicoli')
      } catch {
        toast.error('Si è verificato un errore imprevisto')
      }
    })
  }

  // ── Field error helper ────────────────────────────────────────────────

  function fieldError(name: string) {
    return errors[name] ? (
      <p className="mt-1 text-xs text-red-600">{errors[name]}</p>
    ) : null
  }

  const inputBase =
    'w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/10'
  const selectBase =
    'w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text-primary transition-colors focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/10'
  const labelBase = 'mb-1.5 block text-sm font-medium text-text-primary'

  function inputError(name: string) {
    return errors[name] ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
  }

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ── Section: Info Base ────────────────────────────────────────────── */}
      <section className="rounded-xl border border-border bg-white p-6">
        <h2 className="mb-5 font-heading text-lg font-bold text-text-primary">
          Informazioni Base
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <label htmlFor="brand" className={labelBase}>
              Marca *
            </label>
            <select
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className={cn(selectBase, inputError('brand'))}
            >
              <option value="">Seleziona marca</option>
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
              <option value="Altro">Altro</option>
            </select>
            {fieldError('brand')}
          </div>

          {/* Model */}
          <div>
            <label htmlFor="model" className={labelBase}>
              Modello *
            </label>
            <input
              id="model"
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="es. A3 Sportback"
              className={cn(inputBase, inputError('model'))}
            />
            {fieldError('model')}
          </div>

          {/* Version */}
          <div>
            <label htmlFor="version" className={labelBase}>
              Versione
            </label>
            <input
              id="version"
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="es. 35 TDI S-Tronic"
              className={inputBase}
            />
          </div>

          {/* Year */}
          <div>
            <label htmlFor="year" className={labelBase}>
              Anno *
            </label>
            <input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              min={1990}
              max={new Date().getFullYear() + 1}
              className={cn(inputBase, inputError('year'))}
            />
            {fieldError('year')}
          </div>

          {/* Mileage */}
          <div>
            <label htmlFor="mileage" className={labelBase}>
              Chilometraggio (km) *
            </label>
            <input
              id="mileage"
              type="number"
              value={mileage}
              onChange={(e) => setMileage(Number(e.target.value))}
              min={0}
              className={cn(inputBase, inputError('mileage'))}
            />
            {fieldError('mileage')}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className={labelBase}>
              Slug URL
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value)
                setSlugManual(true)
              }}
              placeholder="auto-generato"
              className={inputBase}
            />
            <p className="mt-1 text-xs text-text-muted">
              Lascia vuoto per generazione automatica
            </p>
          </div>
        </div>
      </section>

      {/* ── Section: Specifiche ───────────────────────────────────────────── */}
      <section className="rounded-xl border border-border bg-white p-6">
        <h2 className="mb-5 font-heading text-lg font-bold text-text-primary">
          Specifiche Tecniche
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Fuel type */}
          <div>
            <label htmlFor="fuel_type" className={labelBase}>
              Alimentazione *
            </label>
            <select
              id="fuel_type"
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value as typeof fuelType)}
              className={cn(selectBase, inputError('fuel_type'))}
            >
              {FUEL_TYPES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            {fieldError('fuel_type')}
          </div>

          {/* Transmission */}
          <div>
            <label htmlFor="transmission" className={labelBase}>
              Cambio *
            </label>
            <select
              id="transmission"
              value={transmission}
              onChange={(e) =>
                setTransmission(e.target.value as typeof transmission)
              }
              className={cn(selectBase, inputError('transmission'))}
            >
              {TRANSMISSION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {fieldError('transmission')}
          </div>

          {/* Power HP */}
          <div>
            <label htmlFor="power_hp" className={labelBase}>
              Potenza (CV)
            </label>
            <input
              id="power_hp"
              type="number"
              value={powerHp}
              onChange={(e) => setPowerHp(e.target.value)}
              placeholder="es. 150"
              min={0}
              className={inputBase}
            />
          </div>

          {/* Power kW */}
          <div>
            <label htmlFor="power_kw" className={labelBase}>
              Potenza (kW)
            </label>
            <input
              id="power_kw"
              type="number"
              value={powerKw}
              onChange={(e) => setPowerKw(e.target.value)}
              placeholder="es. 110"
              min={0}
              className={inputBase}
            />
          </div>

          {/* Engine CC */}
          <div>
            <label htmlFor="engine_cc" className={labelBase}>
              Cilindrata (cc)
            </label>
            <input
              id="engine_cc"
              type="number"
              value={engineCc}
              onChange={(e) => setEngineCc(e.target.value)}
              placeholder="es. 1968"
              min={0}
              className={inputBase}
            />
          </div>

          {/* Body type */}
          <div>
            <label htmlFor="body_type" className={labelBase}>
              Carrozzeria
            </label>
            <select
              id="body_type"
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value)}
              className={selectBase}
            >
              <option value="">Seleziona</option>
              {BODY_TYPES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Doors */}
          <div>
            <label htmlFor="doors" className={labelBase}>
              Porte
            </label>
            <select
              id="doors"
              value={doors}
              onChange={(e) => setDoors(e.target.value)}
              className={selectBase}
            >
              <option value="">Seleziona</option>
              {[2, 3, 4, 5].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Seats */}
          <div>
            <label htmlFor="seats" className={labelBase}>
              Posti
            </label>
            <select
              id="seats"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              className={selectBase}
            >
              <option value="">Seleziona</option>
              {[1, 2, 4, 5, 6, 7, 8, 9].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Emission class */}
          <div>
            <label htmlFor="emission_class" className={labelBase}>
              Classe emissione
            </label>
            <select
              id="emission_class"
              value={emissionClass}
              onChange={(e) => setEmissionClass(e.target.value)}
              className={selectBase}
            >
              <option value="">Seleziona</option>
              {EMISSION_CLASSES.map((ec) => (
                <option key={ec} value={ec}>
                  {ec}
                </option>
              ))}
            </select>
          </div>

          {/* Drive type */}
          <div>
            <label htmlFor="drive_type" className={labelBase}>
              Trazione
            </label>
            <select
              id="drive_type"
              value={driveType}
              onChange={(e) => setDriveType(e.target.value)}
              className={selectBase}
            >
              <option value="">Seleziona</option>
              {DRIVE_TYPES.map((dt) => (
                <option key={dt} value={dt}>
                  {dt}
                </option>
              ))}
            </select>
          </div>

          {/* Color Exterior */}
          <div>
            <label htmlFor="color_exterior" className={labelBase}>
              Colore esterno
            </label>
            <input
              id="color_exterior"
              type="text"
              value={colorExterior}
              onChange={(e) => setColorExterior(e.target.value)}
              placeholder="es. Nero metallizzato"
              className={inputBase}
            />
          </div>

          {/* Color Interior */}
          <div>
            <label htmlFor="color_interior" className={labelBase}>
              Colore interno
            </label>
            <input
              id="color_interior"
              type="text"
              value={colorInterior}
              onChange={(e) => setColorInterior(e.target.value)}
              placeholder="es. Pelle nera"
              className={inputBase}
            />
          </div>
        </div>

        {/* New driver checkbox */}
        <div className="mt-5">
          <label className="inline-flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={newDriverOk}
              onChange={(e) => setNewDriverOk(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-text-primary">
              Adatta per neopatentati
            </span>
          </label>
        </div>
      </section>

      {/* ── Section: Prezzo ───────────────────────────────────────────────── */}
      <section className="rounded-xl border border-border bg-white p-6">
        <h2 className="mb-5 font-heading text-lg font-bold text-text-primary">
          Prezzo
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Price */}
          <div>
            <label htmlFor="price" className={labelBase}>
              Prezzo (EUR) *
            </label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="es. 28900"
              min={0}
              step={100}
              className={cn(inputBase, inputError('price'))}
            />
            {fieldError('price')}
          </div>

          {/* Monthly payment */}
          <div>
            <label htmlFor="monthly_payment" className={labelBase}>
              Rata mensile (EUR)
            </label>
            <input
              id="monthly_payment"
              type="number"
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(e.target.value)}
              placeholder="Calcolata automaticamente"
              min={0}
              className={inputBase}
            />
            <p className="mt-1 text-xs text-text-muted">
              Calcolata su 48 mesi. Modificabile manualmente.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section: Descrizione ──────────────────────────────────────────── */}
      <section className="rounded-xl border border-border bg-white p-6">
        <h2 className="mb-5 font-heading text-lg font-bold text-text-primary">
          Descrizione
        </h2>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder="Descrizione del veicolo (opzionale)..."
          className={cn(inputBase, 'resize-y')}
        />
      </section>

      {/* ── Section: Dotazioni ────────────────────────────────────────────── */}
      <section className="rounded-xl border border-border bg-white p-6">
        <h2 className="mb-5 font-heading text-lg font-bold text-text-primary">
          Dotazioni
        </h2>

        <FeaturesEditor features={features} onChange={setFeatures} />
      </section>

      {/* ── Section: Immagini ─────────────────────────────────────────────── */}
      <section className="rounded-xl border border-border bg-white p-6">
        <h2 className="mb-5 font-heading text-lg font-bold text-text-primary">
          Immagini
        </h2>

        <ImageUploader
          vehicleId={vehicle?.id}
          existingImages={vehicle?.images}
          localImages={localImages}
          onImagesChange={setLocalImages}
        />
      </section>

      {/* ── Section: Stato ────────────────────────────────────────────────── */}
      <section className="rounded-xl border border-border bg-white p-6">
        <h2 className="mb-5 font-heading text-lg font-bold text-text-primary">
          Stato e Visibilità
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Status */}
          <div>
            <label htmlFor="status" className={labelBase}>
              Stato
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as typeof status)
              }
              className={selectBase}
            >
              <option value="disponibile">Disponibile</option>
              <option value="riservata">Riservata</option>
              <option value="venduta">Venduta</option>
            </select>
          </div>

          {/* Featured */}
          <div className="flex items-end">
            <label className="inline-flex cursor-pointer items-center gap-3 pb-2.5">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-text-primary">
                In evidenza nella homepage
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* ── Submit ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-4 pb-8">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/admin/veicoli')}
          disabled={isPending}
        >
          Annulla
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isPending}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvataggio...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEdit ? 'Aggiorna Veicolo' : 'Crea Veicolo'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
