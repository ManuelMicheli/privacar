import Link from 'next/link'
import { Home, Search, AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        {/* Illustration area */}
        <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-bg-alt">
          <AlertTriangle className="h-16 w-16 text-primary" />
        </div>

        {/* Heading */}
        <h1 className="font-heading text-4xl font-bold text-primary">
          404
        </h1>
        <h2 className="mt-2 font-heading text-xl font-semibold text-text-primary">
          Pagina non trovata
        </h2>

        {/* Description */}
        <p className="mt-4 text-text-secondary">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-light sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Torna alla Home
          </Link>
          <Link
            href="/auto"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-light sm:w-auto"
          >
            <Search className="h-4 w-4" />
            Cerca un&apos;auto
          </Link>
        </div>
      </div>
    </div>
  )
}
