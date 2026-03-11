'use client'

import { useState, useEffect, useCallback } from 'react'
import Slider from 'rc-slider'
import { cn } from '@/lib/utils/cn'

import 'rc-slider/assets/index.css'

export interface RangeSliderProps {
  label: string
  min: number
  max: number
  step: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  formatValue?: (n: number) => string
}

export function RangeSlider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  formatValue,
}: RangeSliderProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value)

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleSliderChange = useCallback(
    (val: number | number[]) => {
      if (Array.isArray(val)) {
        const newValue: [number, number] = [val[0], val[1]]
        setLocalValue(newValue)
      }
    },
    []
  )

  const handleSliderAfterChange = useCallback(
    (val: number | number[]) => {
      if (Array.isArray(val)) {
        onChange([val[0], val[1]])
      }
    },
    [onChange]
  )

  const handleMinInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '')
      const num = raw === '' ? min : Number(raw)
      const clamped = Math.min(Math.max(num, min), localValue[1])
      setLocalValue([clamped, localValue[1]])
    },
    [min, localValue]
  )

  const handleMaxInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '')
      const num = raw === '' ? max : Number(raw)
      const clamped = Math.max(Math.min(num, max), localValue[0])
      setLocalValue([localValue[0], clamped])
    },
    [max, localValue]
  )

  const handleMinBlur = useCallback(() => {
    onChange(localValue)
  }, [localValue, onChange])

  const handleMaxBlur = useCallback(() => {
    onChange(localValue)
  }, [localValue, onChange])

  const handleMinKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onChange(localValue)
      }
    },
    [localValue, onChange]
  )

  const handleMaxKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onChange(localValue)
      }
    },
    [localValue, onChange]
  )

  const displayMin = formatValue ? formatValue(localValue[0]) : String(localValue[0])
  const displayMax = formatValue ? formatValue(localValue[1]) : String(localValue[1])

  return (
    <div className="space-y-3">
      {/* Min / Max input fields */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-xs text-text-muted">Da</label>
          <input
            type="text"
            inputMode="numeric"
            value={displayMin}
            onChange={handleMinInput}
            onBlur={handleMinBlur}
            onKeyDown={handleMinKeyDown}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-[#065F46] focus:ring-1 focus:ring-[#065F46]"
            aria-label={`${label} minimo`}
          />
        </div>
        <span className="mt-5 text-text-muted">—</span>
        <div className="flex-1">
          <label className="mb-1 block text-xs text-text-muted">A</label>
          <input
            type="text"
            inputMode="numeric"
            value={displayMax}
            onChange={handleMaxInput}
            onBlur={handleMaxBlur}
            onKeyDown={handleMaxKeyDown}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-[#065F46] focus:ring-1 focus:ring-[#065F46]"
            aria-label={`${label} massimo`}
          />
        </div>
      </div>

      {/* Slider */}
      <div className="px-1">
        <Slider
          range
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleSliderChange}
          onChangeComplete={handleSliderAfterChange}
          styles={{
            track: { backgroundColor: '#065F46', height: 4 },
            rail: { backgroundColor: '#E5E7EB', height: 4 },
            handle: {
              backgroundColor: '#FFFFFF',
              borderColor: '#065F46',
              borderWidth: 2,
              width: 20,
              height: 20,
              marginTop: -8,
              opacity: 1,
              boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
            },
          }}
          aria-label={[`${label} minimo`, `${label} massimo`]}
        />
      </div>
    </div>
  )
}
