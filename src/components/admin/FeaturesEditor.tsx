'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { VehicleFeatures } from '@/types'

interface FeaturesEditorProps {
  features: VehicleFeatures
  onChange: (features: VehicleFeatures) => void
}

const categories: { key: keyof VehicleFeatures; label: string }[] = [
  { key: 'comfort', label: 'Comfort' },
  { key: 'sicurezza', label: 'Sicurezza' },
  { key: 'infotainment', label: 'Infotainment' },
  { key: 'altro', label: 'Altro' },
]

export function FeaturesEditor({ features, onChange }: FeaturesEditorProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['comfort']))
  const [inputs, setInputs] = useState<Record<string, string>>({})

  function toggleExpand(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  function addItem(category: keyof VehicleFeatures) {
    const value = inputs[category]?.trim()
    if (!value) return

    const currentItems = features[category] ?? []
    if (currentItems.includes(value)) return

    onChange({
      ...features,
      [category]: [...currentItems, value],
    })

    setInputs((prev) => ({ ...prev, [category]: '' }))
  }

  function removeItem(category: keyof VehicleFeatures, index: number) {
    const currentItems = features[category] ?? []
    onChange({
      ...features,
      [category]: currentItems.filter((_, i) => i !== index),
    })
  }

  function handleKeyDown(
    e: React.KeyboardEvent,
    category: keyof VehicleFeatures
  ) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addItem(category)
    }
  }

  return (
    <div className="space-y-2">
      {categories.map(({ key, label }) => {
        const isExpanded = expanded.has(key)
        const items = features[key] ?? []

        return (
          <div
            key={key}
            className="rounded-xl border border-border bg-white overflow-hidden"
          >
            {/* Header */}
            <button
              type="button"
              onClick={() => toggleExpand(key)}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-text-muted" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-text-muted" />
                )}
                <span className="text-sm font-medium text-text-primary">
                  {label}
                </span>
              </div>
              <span className="text-xs text-text-muted">
                {items.length} {items.length === 1 ? 'elemento' : 'elementi'}
              </span>
            </button>

            {/* Content */}
            {isExpanded && (
              <div className="border-t border-border px-4 py-3">
                {/* Chips */}
                {items.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {items.map((item, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => removeItem(key, index)}
                          className="rounded-full p-0.5 transition-colors hover:bg-primary/10"
                          aria-label={`Rimuovi ${item}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Add input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputs[key] ?? ''}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    onKeyDown={(e) => handleKeyDown(e, key)}
                    placeholder={`Aggiungi ${label.toLowerCase()}...`}
                    className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/10"
                  />
                  <button
                    type="button"
                    onClick={() => addItem(key)}
                    disabled={!inputs[key]?.trim()}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      inputs[key]?.trim()
                        ? 'bg-primary text-white hover:bg-primary-light'
                        : 'bg-gray-100 text-text-muted cursor-not-allowed'
                    )}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Aggiungi
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
