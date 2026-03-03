export default function ParksLoading() {
  return (
    <main className="min-h-screen">
      {/* Hero skeleton */}
      <div className="relative overflow-hidden bg-[var(--color-surface)]">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-10">
          <div className="h-10 w-64 rounded bg-white/10 animate-pulse mb-2" />
          <div className="h-4 w-48 rounded bg-white/10 animate-pulse mb-8" />
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 h-10 rounded-lg bg-white/10 animate-pulse" />
            <div className="h-10 w-[160px] rounded-lg bg-white/10 animate-pulse" />
            <div className="h-10 w-[160px] rounded-lg bg-white/10 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="h-4 w-24 rounded bg-white/10 animate-pulse mb-6" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden bg-white/5 animate-pulse">
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
    </main>
  );
}
