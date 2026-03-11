import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string>
}

function buildUrl(
  baseUrl: string,
  page: number,
  searchParams?: Record<string, string>
): string {
  const params = new URLSearchParams(searchParams)
  if (page > 1) {
    params.set('page', String(page))
  } else {
    params.delete('page')
  }
  const query = params.toString()
  return query ? `${baseUrl}?${query}` : baseUrl
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | 'ellipsis')[] = [1]

  if (current > 3) {
    pages.push('ellipsis')
  }

  const rangeStart = Math.max(2, current - 1)
  const rangeEnd = Math.min(total - 1, current + 1)

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i)
  }

  if (current < total - 2) {
    pages.push('ellipsis')
  }

  pages.push(total)

  return pages
}

const basePageClass =
  'inline-flex items-center justify-center min-w-[40px] h-[40px] rounded-lg text-sm font-medium transition-colors'

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <nav aria-label="Paginazione" className="flex items-center justify-center gap-1">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(baseUrl, currentPage - 1, searchParams)}
          className={cn(basePageClass, 'hover:bg-gray-100 text-primary')}
          aria-label="Pagina precedente"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span
          className={cn(basePageClass, 'pointer-events-none text-gray-300')}
          aria-disabled="true"
        >
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page, idx) => {
        if (page === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${idx}`}
              className={cn(basePageClass, 'pointer-events-none text-gray-400')}
              aria-hidden="true"
            >
              &hellip;
            </span>
          )
        }

        const isCurrent = page === currentPage

        return (
          <Link
            key={page}
            href={buildUrl(baseUrl, page, searchParams)}
            className={cn(
              basePageClass,
              isCurrent
                ? 'bg-primary text-white pointer-events-none'
                : 'text-primary hover:bg-gray-100'
            )}
            aria-label={`Pagina ${page}`}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {page}
          </Link>
        )
      })}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(baseUrl, currentPage + 1, searchParams)}
          className={cn(basePageClass, 'hover:bg-gray-100 text-primary')}
          aria-label="Pagina successiva"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span
          className={cn(basePageClass, 'pointer-events-none text-gray-300')}
          aria-disabled="true"
        >
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  )
}
