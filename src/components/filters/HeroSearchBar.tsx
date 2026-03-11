'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { BRANDS, FUEL_TYPES } from '@/lib/utils/constants'

const PRICE_RANGES = [
  { label: 'Qualsiasi', value: '' },
  { label: 'Fino a €10.000', value: '10000' },
  { label: '€10.000 - €20.000', value: '10000-20000' },
  { label: '€20.000 - €30.000', value: '20000-30000' },
  { label: 'Oltre €30.000', value: '30000+' },
]

export function HeroSearchBar() {
  const router = useRouter()
  const [brand, setBrand] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [fuel, setFuel] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const params = new URLSearchParams()

    if (brand) {
      params.set('brand', brand)
    }

    if (priceRange) {
      if (priceRange.includes('-')) {
        const [min, max] = priceRange.split('-')
        params.set('price_min', min)
        params.set('price_max', max)
      } else if (priceRange.endsWith('+')) {
        params.set('price_min', priceRange.replace('+', ''))
      } else {
        params.set('price_max', priceRange)
      }
    }

    if (fuel) {
      params.set('fuel_type', fuel)
    }

    const queryString = params.toString()
    router.push(`/auto${queryString ? `?${queryString}` : ''}`)
  }

  const selectClasses =
    'w-full appearance-none rounded-lg border border-gray-200/80 bg-white px-4 py-3.5 text-sm text-text-primary outline-none transition-all focus:border-[#065F46] focus:ring-2 focus:ring-[#065F46]/10 hover:border-gray-300'

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/20 bg-white/95 p-5 shadow-2xl backdrop-blur-md md:p-7"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
        {/* Brand Select */}
        <div>
          <label
            htmlFor="hero-brand"
            className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-text-muted"
          >
            Marca
          </label>
          <select
            id="hero-brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className={selectClasses}
          >
            <option value="">Tutte le marche</option>
            {BRANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Select */}
        <div>
          <label
            htmlFor="hero-price"
            className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-text-muted"
          >
            Fascia di Prezzo
          </label>
          <select
            id="hero-price"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className={selectClasses}
          >
            {PRICE_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Fuel Type Select */}
        <div>
          <label
            htmlFor="hero-fuel"
            className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-text-muted"
          >
            Alimentazione
          </label>
          <select
            id="hero-fuel"
            value={fuel}
            onChange={(e) => setFuel(e.target.value)}
            className={selectClasses}
          >
            <option value="">Qualsiasi</option>
            {FUEL_TYPES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Button - full width below */}
      <button
        type="submit"
        className="mt-5 inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98]"
      >
        <Search className="h-5 w-5" />
        Cerca Auto
      </button>
    </form>
  )
}
