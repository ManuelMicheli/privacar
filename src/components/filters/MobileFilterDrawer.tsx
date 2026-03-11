'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, RotateCcw } from 'lucide-react'
import { FilterSidebar } from '@/components/filters/FilterSidebar'

// ─── Props ──────────────────────────────────────────────────────────────────

export interface MobileFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  brands: string[]
  currentFilters: Record<string, string>
}

// ─── Animation Variants ─────────────────────────────────────────────────────

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
} as const

const panelVariants = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: '-100%',
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
    },
  },
} as const

// ─── Component ──────────────────────────────────────────────────────────────

export function MobileFilterDrawer({
  isOpen,
  onClose,
  brands,
  currentFilters,
}: MobileFilterDrawerProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="filter-backdrop"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel — slides from left */}
          <motion.div
            key="filter-panel"
            className="fixed bottom-0 left-0 top-0 z-50 flex w-[85%] max-w-sm flex-col bg-white shadow-2xl"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Filtri di ricerca"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="font-heading text-lg font-bold text-primary">
                Filtri
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-primary/5 hover:text-primary"
                aria-label="Chiudi filtri"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable filter content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <FilterSidebar
                brands={brands}
                currentFilters={currentFilters}
              />
            </div>

            {/* Bottom actions */}
            <div className="border-t border-gray-100 px-5 py-4">
              <div className="flex items-center gap-3">
                {/* Reset */}
                <button
                  type="button"
                  onClick={() => {
                    // Navigate to /auto with no params to reset
                    window.location.href = '/auto'
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:text-primary"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>

                {/* Apply */}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
                >
                  Applica Filtri
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
