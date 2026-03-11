import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Car } from 'lucide-react'
import { getVehicles, getDistinctBrands } from '@/lib/queries/vehicles'
import { ITEMS_PER_PAGE } from '@/lib/utils/constants'
import { VehicleGrid } from '@/components/vehicles/VehicleGrid'
import { Pagination } from '@/components/ui/Pagination'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'
import { CatalogFilters } from './catalog-filters'

// ─── Metadata ───────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Parco Auto',
  description:
    'Scopri il nostro parco auto di vetture selezionate, garantite e finanziabili. Cerca la tua prossima auto a Rho.',
}

// ─── Page ───────────────────────────────────────────────────────────────────

interface CatalogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams

  // Helper to safely get a string param
  const getParam = (key: string): string | undefined => {
    const val = params[key]
    return typeof val === 'string' ? val : undefined
  }

  // ── Parse filters from searchParams ─────────────────────────────────────

  const filterKeys = [
    'brand', 'model', 'fuel_type', 'transmission',
    'price_min', 'price_max', 'year_min', 'year_max',
    'km_min', 'km_max', 'sort', 'page',
  ] as const

  const filters: Record<string, string | undefined> = {}
  for (const key of filterKeys) {
    filters[key] = getParam(key)
  }

  // Default page to 1
  if (!filters.page) {
    filters.page = '1'
  }

  // ── Fetch data ──────────────────────────────────────────────────────────

  const [{ vehicles, count }, brands] = await Promise.all([
    getVehicles(filters),
    getDistinctBrands(),
  ])

  const totalPages = Math.ceil(count / ITEMS_PER_PAGE)
  const currentPage = filters.page ? Number(filters.page) : 1

  // Build plain searchParams record for Pagination component (without 'page')
  const paginationSearchParams: Record<string, string> = {}
  for (const [key, val] of Object.entries(params)) {
    if (key !== 'page' && typeof val === 'string' && val) {
      paginationSearchParams[key] = val
    }
  }

  // Build currentFilters record for filter components
  const currentFilters: Record<string, string> = {}
  for (const [key, val] of Object.entries(params)) {
    if (typeof val === 'string' && val) {
      currentFilters[key] = val
    }
  }

  // Check if any filters are active
  const hasActiveFilters = Object.keys(currentFilters).some(
    (k) => k !== 'sort' && k !== 'page'
  )

  return (
    <main className="min-h-screen bg-bg-alt">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto px-4 py-8 md:py-12 lg:px-12 2xl:px-20">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-1 text-sm text-text-muted"
          >
            <Link
              href="/"
              className="transition-colors hover:text-primary"
            >
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-text-primary">Parco Auto</span>
          </nav>

          <AnimateOnScroll variant="fade-up">
            <h1 className="font-heading text-3xl font-bold text-primary md:text-4xl">
              Il Nostro Parco Auto
            </h1>
            <p className="mt-2 text-lg text-text-secondary">
              <span className="font-semibold text-primary">{count}</span>{' '}
              {count === 1 ? 'vettura disponibile' : 'vetture disponibili'}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div className="mx-auto px-4 py-8 lg:px-12 2xl:px-20">
        <Suspense>
          <CatalogFilters
            brands={brands}
            currentFilters={currentFilters}
            currentSort={filters.sort || ''}
            totalCount={count}
          />
        </Suspense>

        <div className="mt-6 flex gap-8">
          {/* ── Desktop Sidebar ──────────────────────────────────────────── */}
          <aside className="hidden w-[280px] shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <Suspense>
                <CatalogSidebarWrapper
                  brands={brands}
                  currentFilters={currentFilters}
                />
              </Suspense>
            </div>
          </aside>

          {/* ── Main Content ─────────────────────────────────────────────── */}
          <div className="min-w-0 flex-1">
            {vehicles.length > 0 ? (
              <>
                <VehicleGrid vehicles={vehicles} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      baseUrl="/auto"
                      searchParams={paginationSearchParams}
                    />
                  </div>
                )}
              </>
            ) : (
              /* ── Empty State ──────────────────────────────────────────── */
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mb-4 rounded-full bg-bg-alt p-4">
                  <Car className="h-10 w-10 text-text-muted" />
                </div>
                <h2 className="font-heading text-xl font-bold text-primary">
                  Nessun veicolo trovato
                </h2>
                <p className="mt-2 max-w-md text-text-secondary">
                  Non ci sono veicoli che corrispondono ai filtri selezionati.
                  Prova a modificare i criteri di ricerca.
                </p>
                {hasActiveFilters && (
                  <Link
                    href="/auto"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
                  >
                    Resetta filtri
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

// ─── Sidebar Wrapper (for Suspense boundary) ────────────────────────────────

import { FilterSidebar } from '@/components/filters/FilterSidebar'

function CatalogSidebarWrapper({
  brands,
  currentFilters,
}: {
  brands: string[]
  currentFilters: Record<string, string>
}) {
  return (
    <FilterSidebar
      brands={brands}
      currentFilters={currentFilters}
    />
  )
}
