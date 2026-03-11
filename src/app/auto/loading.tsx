import { SkeletonCard } from '@/components/ui/Skeleton'

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 ${className ?? ''}`}
      aria-hidden="true"
    />
  )
}

export default function CatalogLoading() {
  return (
    <main className="min-h-screen bg-bg-alt">
      {/* ── Header Skeleton ──────────────────────────────────────────────── */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto px-4 py-8 md:py-12 lg:px-12 2xl:px-20">
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center gap-2">
            <SkeletonBlock className="h-4 w-12 rounded" />
            <SkeletonBlock className="h-4 w-4 rounded" />
            <SkeletonBlock className="h-4 w-20 rounded" />
          </div>

          {/* Title */}
          <SkeletonBlock className="h-9 w-72 rounded-lg md:h-10" />

          {/* Subtitle */}
          <SkeletonBlock className="mt-3 h-5 w-48 rounded" />
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="mx-auto px-4 py-8 lg:px-12 2xl:px-20">
        {/* Toolbar skeleton */}
        <div className="flex items-center justify-between gap-4">
          {/* Mobile filter button skeleton */}
          <SkeletonBlock className="h-10 w-24 rounded-xl lg:hidden" />
          <div className="hidden lg:block" />
          {/* Sort skeleton */}
          <SkeletonBlock className="h-10 w-44 rounded-xl" />
        </div>

        <div className="mt-6 flex gap-8">
          {/* ── Sidebar Skeleton (desktop only) ────────────────────────── */}
          <aside className="hidden w-[280px] shrink-0 lg:block">
            <div className="sticky top-24 space-y-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              {/* Filter header */}
              <div className="flex items-center justify-between pb-2">
                <SkeletonBlock className="h-6 w-16 rounded" />
              </div>

              {/* Filter sections */}
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="space-y-3 border-t border-gray-100 pt-4">
                  <SkeletonBlock className="h-4 w-24 rounded" />
                  <SkeletonBlock className="h-10 w-full rounded-xl" />
                </div>
              ))}

              {/* Checkbox groups */}
              {Array.from({ length: 2 }, (_, i) => (
                <div key={`cb-${i}`} className="space-y-2 border-t border-gray-100 pt-4">
                  <SkeletonBlock className="h-4 w-28 rounded" />
                  <div className="space-y-2">
                    {Array.from({ length: 3 }, (_, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <SkeletonBlock className="h-5 w-5 rounded" />
                        <SkeletonBlock className="h-4 w-20 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* ── Grid Skeleton ──────────────────────────────────────────── */}
          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 12 }, (_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
