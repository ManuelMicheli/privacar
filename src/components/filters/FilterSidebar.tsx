'use client'

import { useState, useEffect, useCallback, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { RotateCcw } from 'lucide-react'
import { ChevronDown } from '@/components/icons'
import { cn } from '@/lib/utils/cn'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { FUEL_TYPES, TRANSMISSION_TYPES } from '@/lib/utils/constants'
import { formatPrice, formatMileage } from '@/lib/utils/formatters'
import { FilterSelect } from '@/components/filters/FilterSelect'
import { RangeSlider } from '@/components/filters/RangeSlider'
import { FilterCheckboxGroup } from '@/components/filters/FilterCheckboxGroup'

// ─── Constants ──────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear()

const PRICE_MIN = 0
const PRICE_MAX = 60000
const PRICE_STEP = 500

const YEAR_MIN = 2010
const YEAR_MAX = CURRENT_YEAR
const YEAR_STEP = 1

const KM_MIN = 0
const KM_MAX = 200000
const KM_STEP = 5000

// ─── Props ──────────────────────────────────────────────────────────────────

export interface FilterSidebarProps {
  brands: string[]
  currentFilters: Record<string, string>
}

// ─── Collapsible Section ────────────────────────────────────────────────────

interface FilterSectionProps {
  title: string
  badge?: string
  defaultOpen?: boolean
  children: React.ReactNode
}

function FilterSection({
  title,
  badge,
  defaultOpen = true,
  children,
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-100 py-4 first:pt-0 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-primary">{title}</span>
          {badge && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-text-muted transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  )
}

// ─── FilterSidebar ──────────────────────────────────────────────────────────

export function FilterSidebar({
  brands,
  currentFilters,
}: FilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  // ── Local filter state ──────────────────────────────────────────────────

  const [selectedBrand, setSelectedBrand] = useState(
    currentFilters.brand ?? ''
  )
  const [selectedModel, setSelectedModel] = useState(
    currentFilters.model ?? ''
  )
  const [models, setModels] = useState<string[]>([])
  const [loadingModels, setLoadingModels] = useState(false)

  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(currentFilters.price_min) || PRICE_MIN,
    Number(currentFilters.price_max) || PRICE_MAX,
  ])

  const [yearRange, setYearRange] = useState<[number, number]>([
    Number(currentFilters.year_min) || YEAR_MIN,
    Number(currentFilters.year_max) || YEAR_MAX,
  ])

  const [kmRange, setKmRange] = useState<[number, number]>([
    Number(currentFilters.km_min) || KM_MIN,
    Number(currentFilters.km_max) || KM_MAX,
  ])

  const [selectedFuels, setSelectedFuels] = useState<string[]>(
    currentFilters.fuel_type ? currentFilters.fuel_type.split(',') : []
  )

  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>(
    currentFilters.transmission
      ? currentFilters.transmission.split(',')
      : []
  )

  // ── Debounced values for range sliders ──────────────────────────────────

  const debouncedPrice = useDebounce(priceRange, 500)
  const debouncedYear = useDebounce(yearRange, 500)
  const debouncedKm = useDebounce(kmRange, 500)

  // ── Fetch models when brand changes ─────────────────────────────────────

  useEffect(() => {
    if (!selectedBrand) {
      setModels([])
      setSelectedModel('')
      return
    }

    let cancelled = false
    setLoadingModels(true)

    fetch(`/api/vehicles/models?brand=${encodeURIComponent(selectedBrand)}`)
      .then((res) => res.json())
      .then((data: { models: string[] }) => {
        if (!cancelled) {
          setModels(data.models)
          setLoadingModels(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setModels([])
          setLoadingModels(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [selectedBrand])

  // ── Build URL search params and navigate ────────────────────────────────

  const updateSearchParams = useCallback(() => {
    const params = new URLSearchParams()

    if (selectedBrand) params.set('brand', selectedBrand)
    if (selectedModel) params.set('model', selectedModel)

    if (debouncedPrice[0] > PRICE_MIN)
      params.set('price_min', String(debouncedPrice[0]))
    if (debouncedPrice[1] < PRICE_MAX)
      params.set('price_max', String(debouncedPrice[1]))

    if (debouncedYear[0] > YEAR_MIN)
      params.set('year_min', String(debouncedYear[0]))
    if (debouncedYear[1] < YEAR_MAX)
      params.set('year_max', String(debouncedYear[1]))

    if (debouncedKm[0] > KM_MIN)
      params.set('km_min', String(debouncedKm[0]))
    if (debouncedKm[1] < KM_MAX)
      params.set('km_max', String(debouncedKm[1]))

    if (selectedFuels.length > 0)
      params.set('fuel_type', selectedFuels.join(','))
    if (selectedTransmissions.length > 0)
      params.set('transmission', selectedTransmissions.join(','))

    // Preserve sort param
    const currentSort = searchParams.get('sort')
    if (currentSort) params.set('sort', currentSort)

    // Reset to page 1 when filters change
    params.delete('page')

    const query = params.toString()
    startTransition(() => {
      router.push(query ? `/auto?${query}` : '/auto', { scroll: false })
    })
  }, [
    selectedBrand,
    selectedModel,
    debouncedPrice,
    debouncedYear,
    debouncedKm,
    selectedFuels,
    selectedTransmissions,
    searchParams,
    router,
    startTransition,
  ])

  // Trigger URL update when any debounced value changes
  useEffect(() => {
    updateSearchParams()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedBrand,
    selectedModel,
    debouncedPrice,
    debouncedYear,
    debouncedKm,
    selectedFuels,
    selectedTransmissions,
  ])

  // ── Reset all ───────────────────────────────────────────────────────────

  const handleReset = useCallback(() => {
    setSelectedBrand('')
    setSelectedModel('')
    setPriceRange([PRICE_MIN, PRICE_MAX])
    setYearRange([YEAR_MIN, YEAR_MAX])
    setKmRange([KM_MIN, KM_MAX])
    setSelectedFuels([])
    setSelectedTransmissions([])
  }, [])

  // ── Active filter count ─────────────────────────────────────────────────

  const activeFilterCount = [
    selectedBrand,
    selectedModel,
    priceRange[0] > PRICE_MIN || priceRange[1] < PRICE_MAX,
    yearRange[0] > YEAR_MIN || yearRange[1] < YEAR_MAX,
    kmRange[0] > KM_MIN || kmRange[1] < KM_MAX,
    selectedFuels.length > 0,
    selectedTransmissions.length > 0,
  ].filter(Boolean).length

  // ── Brand change handler ────────────────────────────────────────────────

  const handleBrandChange = useCallback((value: string) => {
    setSelectedBrand(value)
    setSelectedModel('')
  }, [])

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <h2 className="font-heading text-lg font-bold text-primary">Filtri</h2>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-sm text-primary transition-colors hover:text-primary-light"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Resetta
          </button>
        )}
      </div>

      {/* Marca */}
      <FilterSection
        title="Marca"
        badge={selectedBrand || undefined}
      >
        <FilterSelect
          label="Marca"
          options={brands}
          value={selectedBrand}
          onChange={handleBrandChange}
          placeholder="Tutte le marche"
        />
      </FilterSection>

      {/* Modello */}
      <FilterSection
        title="Modello"
        badge={selectedModel || undefined}
      >
        <FilterSelect
          label="Modello"
          options={models}
          value={selectedModel}
          onChange={setSelectedModel}
          placeholder={
            loadingModels
              ? 'Caricamento...'
              : selectedBrand
                ? 'Tutti i modelli'
                : 'Seleziona prima la marca'
          }
          disabled={!selectedBrand || loadingModels}
        />
      </FilterSection>

      {/* Prezzo */}
      <FilterSection
        title="Prezzo"
        badge={
          priceRange[0] > PRICE_MIN || priceRange[1] < PRICE_MAX
            ? `${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`
            : undefined
        }
      >
        <RangeSlider
          label="Prezzo"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={priceRange}
          onChange={setPriceRange}
          formatValue={formatPrice}
        />
      </FilterSection>

      {/* Anno */}
      <FilterSection
        title="Anno"
        badge={
          yearRange[0] > YEAR_MIN || yearRange[1] < YEAR_MAX
            ? `${yearRange[0]} - ${yearRange[1]}`
            : undefined
        }
      >
        <RangeSlider
          label="Anno"
          min={YEAR_MIN}
          max={YEAR_MAX}
          step={YEAR_STEP}
          value={yearRange}
          onChange={setYearRange}
        />
      </FilterSection>

      {/* Chilometraggio */}
      <FilterSection
        title="Chilometraggio"
        badge={
          kmRange[0] > KM_MIN || kmRange[1] < KM_MAX
            ? `${formatMileage(kmRange[0])} - ${formatMileage(kmRange[1])}`
            : undefined
        }
      >
        <RangeSlider
          label="Chilometraggio"
          min={KM_MIN}
          max={KM_MAX}
          step={KM_STEP}
          value={kmRange}
          onChange={setKmRange}
          formatValue={formatMileage}
        />
      </FilterSection>

      {/* Alimentazione */}
      <FilterSection
        title="Alimentazione"
        badge={
          selectedFuels.length > 0
            ? String(selectedFuels.length)
            : undefined
        }
      >
        <FilterCheckboxGroup
          label="Alimentazione"
          options={FUEL_TYPES}
          selected={selectedFuels}
          onChange={setSelectedFuels}
        />
      </FilterSection>

      {/* Cambio */}
      <FilterSection
        title="Cambio"
        badge={
          selectedTransmissions.length > 0
            ? String(selectedTransmissions.length)
            : undefined
        }
        defaultOpen={true}
      >
        <FilterCheckboxGroup
          label="Cambio"
          options={TRANSMISSION_TYPES}
          selected={selectedTransmissions}
          onChange={setSelectedTransmissions}
        />
      </FilterSection>

      {/* Reset button at bottom */}
      {activeFilterCount > 0 && (
        <div className="pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:border-primary hover:text-primary"
          >
            <RotateCcw className="h-4 w-4" />
            Resetta tutti i filtri
          </button>
        </div>
      )}
    </div>
  )
}
