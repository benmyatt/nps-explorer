export default function StateLoading() {
  return (
    <main className="min-h-screen">
      {/* Header skeleton */}
      <header className="sticky top-12 z-20 bg-[var(--color-bg)]/90 backdrop-blur border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <div className="h-5 w-5 rounded bg-white/10 animate-pulse" />
          <div>
            <div className="h-6 w-40 rounded bg-white/10 animate-pulse" />
            <div className="h-3 w-20 rounded bg-white/10 animate-pulse mt-1" />
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-73px)]">
        {/* Map placeholder */}
        <div className="lg:w-1/2 h-[40vh] lg:h-[calc(100vh-73px)] bg-[var(--color-bg)] animate-pulse" />

        {/* Card skeletons */}
        <div className="lg:w-1/2 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden bg-white/5 animate-pulse"
              >
                <div className="h-40 bg-white/10" />
                <div className="p-4 space-y-2">
                  <div className="h-3 w-20 rounded bg-white/10" />
                  <div className="h-5 w-3/4 rounded bg-white/10" />
                  <div className="h-3 w-full rounded bg-white/10" />
                  <div className="h-3 w-2/3 rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
