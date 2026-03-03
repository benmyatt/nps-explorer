import { fetchNewsReleases, getAllParks } from "@/lib/nps";
import type { Metadata } from "next";
import NewsList from "./NewsList";

export const metadata: Metadata = {
  title: "Newsroom | NPS Explorer",
  description: "Latest news releases from the National Park Service",
};

export default async function NewsroomPage() {
  const [rawReleases, parks] = await Promise.all([
    fetchNewsReleases(),
    getAllParks(),
  ]);

  const parkImages = new Map<string, string>();
  for (const p of parks) {
    if (p.images[0]?.url) parkImages.set(p.parkCode, p.images[0].url);
  }

  const releases = rawReleases
    .sort((a, b) => {
      const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
      const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
      return dateB - dateA;
    })
    .map((r) => ({
      id: r.id,
      url: r.url,
      title: r.title,
      parkCode: r.parkCode,
      abstract: r.abstract,
      releaseDate: r.releaseDate,
      imageUrl: r.image?.url || parkImages.get(r.parkCode) || null,
    }));

  return (
    <main className="min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Newsroom</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{releases.length} news releases</p>
        </div>

        <NewsList releases={releases} />
      </div>
    </main>
  );
}
