'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { ChevronDown, Search, Close } from '@/components/icons'
import { cn } from '@/lib/utils/cn'

export interface FilterSelectProps {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function FilterSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Seleziona...',
  disabled = false,
}: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter options by search query
  const filteredOptions = useMemo(
    () =>
      options.filter((opt) =>
        opt.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [options, searchQuery]
  )

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSelect = useCallback(
    (opt: string) => {
      onChange(opt)
      setIsOpen(false)
      setSearchQuery('')
    },
    [onChange]
  )

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onChange('')
      setSearchQuery('')
    },
    [onChange]
  )

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev)
      setSearchQuery('')
    }
  }, [disabled])

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          'flex w-full items-center justify-between rounded-xl border bg-white px-3 py-2.5 text-sm transition-colors',
          isOpen
            ? 'border-[#065F46] ring-2 ring-[#065F46]/10'
            : 'border-gray-200 hover:border-gray-300',
          disabled && 'cursor-not-allowed bg-gray-50 opacity-60'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={label}
      >
        <span
          className={cn(
            'truncate',
            value ? 'text-text-primary' : 'text-text-muted'
          )}
        >
          {value || placeholder}
        </span>

        <div className="flex shrink-0 items-center gap-1">
          {value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleClear(e as unknown as React.MouseEvent)
              }}
              className="rounded p-0.5 hover:bg-gray-100"
              aria-label={`Rimuovi ${label}`}
            >
              <Close className="h-3.5 w-3.5 text-text-muted" />
            </span>
          )}
          <ChevronDown
            className={cn(
              'h-4 w-4 text-text-muted transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          {/* Search */}
          {options.length > 5 && (
            <div className="border-b border-gray-100 p-2">
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                <Search className="h-4 w-4 text-text-muted" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cerca..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted"
                  aria-label={`Cerca ${label}`}
                />
              </div>
            </div>
          )}

          {/* Options */}
          <ul
            className="max-h-48 overflow-y-auto py-1"
            role="listbox"
            aria-label={label}
          >
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-center text-sm text-text-muted">
                Nessun risultato
              </li>
            ) : (
              filteredOptions.map((opt) => (
                <li
                  key={opt}
                  role="option"
                  aria-selected={opt === value}
                  className={cn(
                    'cursor-pointer px-3 py-2 text-sm transition-colors',
                    opt === value
                      ? 'bg-primary/5 font-medium text-primary'
                      : 'text-text-primary hover:bg-gray-50'
                  )}
                  onClick={() => handleSelect(opt)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleSelect(opt)
                  }}
                  tabIndex={0}
                >
                  {opt}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
