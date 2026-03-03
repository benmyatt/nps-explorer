export default function ActivitiesLoading() {
  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="h-8 w-40 rounded bg-white/10 animate-pulse mb-2" />
        <div className="h-4 w-56 rounded bg-white/10 animate-pulse mb-6" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="p-4 rounded-lg bg-white/5 animate-pulse">
              <div className="h-5 w-3/4 rounded bg-white/10 mb-2" />
              <div className="h-3 w-20 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
