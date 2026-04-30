export default function LoadingPanel() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="mb-10">
        <div className="mb-2 h-3 w-24 rounded-lg bg-neutral-100 animate-pulse" />
        <div className="h-8 w-64 rounded-lg bg-neutral-100 animate-pulse" />
        <div className="mt-3 h-4 w-96 rounded-lg bg-neutral-50 animate-pulse" />
      </div>

      {/* KPI skeleton grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-neutral-100 bg-white p-7 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-3">
                <div className="h-3 w-20 rounded-lg bg-neutral-100 animate-pulse" />
                <div className="h-7 w-16 rounded-lg bg-neutral-100 animate-pulse" />
              </div>
              <div className="h-11 w-11 rounded-xl bg-neutral-50 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
