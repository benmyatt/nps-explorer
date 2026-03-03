export default function EventsLoading() {
  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="h-8 w-32 rounded bg-white/10 animate-pulse mb-2" />
        <div className="h-4 w-44 rounded bg-white/10 animate-pulse mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-5 rounded-xl bg-white/5 animate-pulse space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-2/3 rounded bg-white/10" />
                  <div className="h-3 w-40 rounded bg-white/10" />
                </div>
                <div className="h-6 w-24 rounded-full bg-white/10 shrink-0" />
              </div>
              <div className="h-3 w-full rounded bg-white/10" />
              <div className="h-3 w-4/5 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
