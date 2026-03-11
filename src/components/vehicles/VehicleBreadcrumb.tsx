import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export interface VehicleBreadcrumbProps {
  brand: string
  model: string
}

export function VehicleBreadcrumb({ brand, model }: VehicleBreadcrumbProps) {
  const items = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Parco Auto', href: '/auto' },
    { label: brand, href: `/auto?brand=${encodeURIComponent(brand)}` },
    { label: model, href: null },
  ]

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight
                className="h-3.5 w-3.5 text-text-muted"
                aria-hidden="true"
              />
            )}

            {item.href ? (
              <Link
                href={item.href}
                className="inline-flex items-center gap-1 text-text-secondary transition-colors hover:text-primary"
              >
                {item.icon && <item.icon className="h-3.5 w-3.5" />}
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-text-primary" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
