export default function LoadingTable() {
  return (
    <div className="animate-fade-in">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="mb-3 h-3 w-20 rounded-pill bg-surface-200" />
        <div className="h-8 w-48 rounded-btn bg-surface-200" />
        <div className="mt-3 h-4 w-80 rounded-btn bg-surface-100" />
      </div>

      {/* Create form skeleton */}
      <div className="mb-6 rounded-hero border border-slate/10 bg-white p-5 shadow-card">
        <div className="grid gap-3 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-20 rounded-pill bg-surface-200" />
              <div className="h-11 rounded-xl bg-surface-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-hero border border-slate/10 bg-white shadow-card">
        <div className="border-b border-slate/10 bg-canvas px-6 py-3">
          <div className="flex gap-12">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-3 w-20 rounded-pill bg-surface-200" />
            ))}
          </div>
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-12 border-b border-slate/5 px-6 py-4 last:border-b-0"
          >
            {Array.from({ length: 5 }).map((_, j) => (
              <div
                key={j}
                className="h-4 rounded-btn bg-surface-100"
                style={{ width: `${60 + (j * 20) % 60}px` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
