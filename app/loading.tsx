export default function HomeLoading() {
  return (
    <main className="relative w-screen overflow-hidden" style={{ height: "calc(100vh - 48px)" }}>
      <div className="w-full h-full bg-[var(--color-surface)] animate-pulse" />
    </main>
  );
}
