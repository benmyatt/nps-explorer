import Link from "next/link";
import Image from "next/image";
import { getDesignationColors } from "@/lib/designation-colors";

interface Props {
  parkCode: string;
  name: string;
  designation: string;
  imageUrl: string | null;
  description?: string;
}

export default function ParkCard({
  parkCode,
  name,
  designation,
  imageUrl,
  description,
}: Props) {
  const [textColor, bgColor] = getDesignationColors(designation);

  return (
    <Link
      href={`/park/${parkCode}`}
      className="group block h-full rounded-xl overflow-hidden bg-[var(--color-surface)] border border-white/5 hover:border-[var(--color-accent-dim)] transition-all duration-300 hover:shadow-lg hover:shadow-green-900/20 hover:-translate-y-0.5"
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
        <span className={`inline-block text-xs font-medium uppercase tracking-wider mb-1 px-2 py-0.5 rounded-full ${textColor} ${bgColor}`}>
          {designation || "Park"}
        </span>
        <h3 className="font-semibold text-[var(--color-text)] leading-tight group-hover:text-[var(--color-accent)] transition-colors">
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
