'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { SortSelect } from '@/components/filters/SortSelect'
import { MobileFilterDrawer } from '@/components/filters/MobileFilterDrawer'

interface CatalogFiltersProps {
  brands: string[]
  currentFilters: Record<string, string>
  currentSort: string
  totalCount: number
}

export function CatalogFilters({
  brands,
  currentFilters,
  currentSort,
  totalCount,
}: CatalogFiltersProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Count active filters (exclude sort and page)
  const activeFilterCount = Object.keys(currentFilters).filter(
    (k) => k !== 'sort' && k !== 'page'
  ).length

  return (
    <>
      {/* Toolbar: sort + mobile filter button */}
      <div className="flex items-center justify-between gap-4">
        {/* Mobile filter button */}
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-text-primary shadow-sm transition-colors hover:border-primary hover:text-primary lg:hidden"
          aria-label="Apri filtri"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtri
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Results count (visible on mobile when filter button is visible) */}
        <p className="text-sm text-text-secondary lg:hidden">
          {totalCount} {totalCount === 1 ? 'risultato' : 'risultati'}
        </p>

        {/* Spacer on desktop */}
        <div className="hidden lg:block" />

        {/* Sort */}
        <SortSelect currentSort={currentSort} />
      </div>

      {/* Mobile filter drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        brands={brands}
        currentFilters={currentFilters}
      />
    </>
  )
}
