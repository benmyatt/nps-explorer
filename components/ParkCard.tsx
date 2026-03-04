"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { getDesignationColors } from "@/lib/designation-colors";

interface AlertInfo {
  category: string;
  date: string;
  title: string;
  url?: string;
}

interface Props {
  parkCode: string;
  name: string;
  designation: string;
  imageUrl: string | null;
  description?: string;
  alert?: AlertInfo;
}

const ALERT_CATEGORY_STYLES: Record<string, string> = {
  Danger: "text-red-400 bg-red-500/10",
  "Park Closure": "text-red-400 bg-red-500/10",
  Caution: "text-amber-400 bg-amber-500/10",
};

export default function ParkCard({
  parkCode,
  name,
  designation,
  imageUrl,
  description,
  alert,
}: Props) {
  const router = useRouter();
  const [textColor, bgColor] = getDesignationColors(designation);

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/park/${parkCode}`)}
      onKeyDown={(e) => { if (e.key === "Enter") router.push(`/park/${parkCode}`); }}
      className="group relative h-full rounded-xl overflow-hidden bg-[var(--color-surface)] border border-white/5 hover:border-[var(--color-accent-dim)] transition-all duration-300 hover:shadow-lg hover:shadow-green-900/20 hover:-translate-y-0.5 cursor-pointer"
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

      {alert && (
        <div style={{ top: "10rem" }} className="absolute left-0 right-0 -translate-y-full px-2 py-1.5 bg-black/70 backdrop-blur-sm flex items-center gap-1.5">
          <span className={`text-[9px] uppercase font-medium px-1.5 py-0.5 rounded-full shrink-0 ${ALERT_CATEGORY_STYLES[alert.category] || "text-blue-400 bg-blue-500/10"}`}>
            {alert.category}
          </span>
          <span className="text-[10px] text-white/50 shrink-0">{alert.date}</span>
          <span className="text-[10px] text-white/70 truncate min-w-0 flex-1">{alert.title}</span>
          <a
            href={alert.url || `https://www.nps.gov/${parkCode.toLowerCase()}/planyourvisit/conditions.htm`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] text-white hover:text-[var(--color-accent)] transition-colors shrink-0"
          >
            View &rarr;
          </a>
        </div>
      )}

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
    </div>
  );
}
