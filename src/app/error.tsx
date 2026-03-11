'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { RefreshCcw, Home, ServerCrash } from 'lucide-react'
import { PageTransition } from '@/components/ui/PageTransition'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <PageTransition>
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        {/* Illustration area */}
        <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-bg-alt">
          <ServerCrash className="h-16 w-16 text-primary" />
        </div>

        {/* Heading */}
        <h1 className="font-heading text-2xl font-bold text-primary">
          Si è verificato un errore
        </h1>

        {/* Description */}
        <p className="mt-4 text-text-secondary">
          Ci scusiamo per l&apos;inconveniente. Riprova o torna alla home.
        </p>

        {/* Error digest for debugging */}
        {error.digest && (
          <p className="mt-2 text-xs text-text-muted">
            Codice errore: {error.digest}
          </p>
        )}

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-light sm:w-auto"
          >
            <RefreshCcw className="h-4 w-4" />
            Riprova
          </button>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary hover:text-white sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Torna alla Home
          </Link>
        </div>
      </div>
    </div>
    </PageTransition>
  )
}
