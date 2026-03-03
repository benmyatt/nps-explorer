export default function LessonPlansLoading() {
  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="h-8 w-44 rounded bg-white/10 animate-pulse mb-2" />
        <div className="h-4 w-52 rounded bg-white/10 animate-pulse mb-6" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="p-5 rounded-xl bg-white/5 animate-pulse space-y-3">
              <div className="h-5 w-full rounded bg-white/10" />
              <div className="h-3 w-4/5 rounded bg-white/10" />
              <div className="flex gap-2 mt-2">
                <div className="h-5 w-16 rounded bg-white/10" />
                <div className="h-5 w-20 rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
