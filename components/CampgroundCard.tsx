import Link from "next/link";
import Image from "next/image";

interface Props {
  id: string;
  name: string;
  imageUrl: string | null;
  description?: string;
  totalSites?: string;
}

export default function CampgroundCard({
  id,
  name,
  imageUrl,
  description,
  totalSites,
}: Props) {
  return (
    <Link
      href={`/campground/${id}`}
      className="group block h-full rounded-xl overflow-hidden bg-[var(--color-surface)] border border-white/5 hover:border-white/30 transition-all duration-300 hover:shadow-lg hover:shadow-white/5/20 hover:-translate-y-0.5"
    >
      <div className="relative h-40 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        ) : (
          <div className="w-full h-full bg-[var(--color-surface-hover)] flex items-center justify-center text-[var(--color-text-muted)]">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-block text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-full text-white bg-white/10">
            Campground
          </span>
          {totalSites && totalSites !== "0" && (
            <span className="text-[10px] text-[var(--color-text-muted)]">
              {totalSites} sites
            </span>
          )}
        </div>
        <h3 className="font-semibold text-[var(--color-text)] leading-tight group-hover:text-white transition-colors">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-[var(--color-text-muted)] mt-2 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}
