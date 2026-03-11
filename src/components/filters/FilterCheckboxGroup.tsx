'use client'

import { useCallback } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface FilterCheckboxGroupProps {
  label: string
  options: readonly { label: string; value: string }[]
  selected: string[]
  onChange: (values: string[]) => void
}

export function FilterCheckboxGroup({
  label,
  options,
  selected,
  onChange,
}: FilterCheckboxGroupProps) {
  const handleToggle = useCallback(
    (value: string) => {
      if (selected.includes(value)) {
        onChange(selected.filter((v) => v !== value))
      } else {
        onChange([...selected, value])
      }
    },
    [selected, onChange]
  )

  return (
    <div className="space-y-2">
      <ul className="space-y-1" role="group" aria-label={label}>
        {options.map((option) => {
          const isChecked = selected.includes(option.value)

          return (
            <li key={option.value}>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50">
                {/* Custom checkbox */}
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
                    isChecked
                      ? 'border-primary bg-primary'
                      : 'border-gray-300 bg-white'
                  )}
                >
                  {isChecked && (
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  )}
                </span>

                {/* Hidden native checkbox for accessibility */}
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isChecked}
                  onChange={() => handleToggle(option.value)}
                  value={option.value}
                  aria-label={option.label}
                />

                <span className="text-sm text-text-primary">
                  {option.label}
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
