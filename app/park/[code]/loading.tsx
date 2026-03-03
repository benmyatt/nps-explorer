export default function ParkLoading() {
  return (
    <main className="min-h-screen">
      {/* Header skeleton */}
      <header className="sticky top-12 z-20 bg-[var(--color-bg)]/90 backdrop-blur border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <div className="h-5 w-5 rounded bg-white/10 animate-pulse" />
          <div>
            <div className="h-6 w-56 rounded bg-white/10 animate-pulse" />
            <div className="h-3 w-32 rounded bg-white/10 animate-pulse mt-1" />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Gallery skeleton */}
        <div className="h-80 rounded-xl bg-white/5 animate-pulse" />

        {/* Description skeleton */}
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-white/10 animate-pulse" />
          <div className="h-4 w-4/6 rounded bg-white/10 animate-pulse" />
        </div>

        {/* Info cards skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-white/5 p-5 animate-pulse space-y-3">
              <div className="h-4 w-24 rounded bg-white/10" />
              <div className="h-3 w-full rounded bg-white/10" />
              <div className="h-3 w-2/3 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
