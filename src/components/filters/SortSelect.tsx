'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowUpDown } from 'lucide-react'
import { SORT_OPTIONS } from '@/lib/utils/constants'
import { cn } from '@/lib/utils/cn'

export interface SortSelectProps {
  currentSort: string
}

export function SortSelect({ currentSort }: SortSelectProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams.toString())
      const value = e.target.value

      if (value && value !== 'created_at_desc') {
        params.set('sort', value)
      } else {
        params.delete('sort')
      }

      // Reset to page 1 on sort change
      params.delete('page')

      const query = params.toString()
      router.push(query ? `/auto?${query}` : '/auto', { scroll: false })
    },
    [router, searchParams]
  )

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-text-muted" />
      <select
        value={currentSort || 'created_at_desc'}
        onChange={handleChange}
        className={cn(
          'rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-text-primary outline-none transition-colors',
          'hover:border-gray-300 focus:border-[#065F46] focus:ring-2 focus:ring-[#065F46]/10'
        )}
        aria-label="Ordina per"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
