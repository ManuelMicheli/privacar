'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

interface AdminTopBarProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

const breadcrumbMap: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/veicoli': 'Veicoli',
  '/admin/veicoli/nuovo': 'Nuovo Veicolo',
  '/admin/contatti': 'Contatti',
  '/admin/appuntamenti': 'Appuntamenti',
  '/admin/impostazioni': 'Impostazioni',
}

function getBreadcrumbs(pathname: string) {
  const parts = pathname.split('/').filter(Boolean)
  const crumbs: { label: string; href: string }[] = []

  let path = ''
  for (const part of parts) {
    path += `/${part}`
    const label = breadcrumbMap[path]
    if (label) {
      crumbs.push({ label, href: path })
    } else if (path.startsWith('/admin/veicoli/') && part !== 'nuovo') {
      crumbs.push({ label: 'Modifica Veicolo', href: path })
    }
  }

  return crumbs
}

export function AdminTopBar({ title, subtitle, children }: AdminTopBarProps) {
  const pathname = usePathname()
  const breadcrumbs = getBreadcrumbs(pathname)

  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs.length > 1 && (
        <nav
          aria-label="Breadcrumb"
          className="mb-3 flex items-center gap-1 text-[13px]"
        >
          {breadcrumbs.map((crumb, i) => {
            const isLast = i === breadcrumbs.length - 1
            return (
              <span key={crumb.href} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3 text-text-muted" />}
                {isLast ? (
                  <span className="font-medium text-text-primary">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-text-muted transition-colors hover:text-primary"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            )
          })}
        </nav>
      )}

      {/* Title row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-text-muted">{subtitle}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </div>
  )
}
