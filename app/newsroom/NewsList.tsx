"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface NewsRelease {
  id: string;
  url: string;
  title: string;
  parkCode: string;
  parkName: string;
  abstract: string;
  releaseDate: string;
  imageUrl: string | null;
}

interface Props {
  releases: NewsRelease[];
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

const PAGE_SIZE = 9;

export default function NewsList({ releases }: Props) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = releases.slice(0, visible);
  const hasMore = visible < releases.length;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((release) => (
          <div
            key={release.id}
            className="rounded-xl overflow-hidden bg-[var(--color-surface)] border border-white/5 hover:border-[var(--color-accent-dim)] transition-all duration-200"
          >
            <div className="relative h-40 overflow-hidden">
              {release.imageUrl ? (
                <Image
                  src={release.imageUrl}
                  alt={release.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              ) : (
                <div className="w-full h-full bg-[var(--color-surface-hover)] flex items-center justify-center text-[var(--color-text-muted)]">
                  No Image
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {release.releaseDate && (
                <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-white/70 backdrop-blur-sm">
                  {formatDate(release.releaseDate)}
                </span>
              )}
            </div>
            <div className="p-4">
              {release.parkCode && (
                <Link
                  href={`/park/${release.parkCode}`}
                  className="text-[10px] text-[var(--color-accent)] hover:underline tracking-wider"
                >
                  {release.parkName}
                </Link>
              )}
              <a
                href={release.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-semibold text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors leading-tight mt-1"
              >
                {release.title}
              </a>
              {release.abstract && (
                <p className="text-sm text-[var(--color-text-muted)] mt-2 line-clamp-2">
                  {release.abstract}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {releases.length === 0 && (
        <p className="text-center py-12 text-[var(--color-text-muted)]">No news releases found</p>
      )}

      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="text-sm px-5 py-2 rounded-full bg-[var(--color-surface)] border border-white/10 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-accent-dim)] transition-all"
          >
            View more ({releases.length - visible} remaining)
          </button>
        </div>
      )}
    </>
  );
}
