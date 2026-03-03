"use client";

import { useState } from "react";
import Image from "next/image";
import type { ParkImage } from "@/lib/nps";

interface Props {
  images: ParkImage[];
}

export default function ParkGallery({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) return null;

  const selected = images[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[var(--color-surface)]">
        <Image
          src={selected.url}
          alt={selected.altText || selected.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
          priority
        />
        {selected.caption && (
          <div className="absolute bottom-0 inset-x-0 bg-black/60 p-4">
            <p className="text-sm text-white/90">{selected.caption}</p>
            {selected.credit && (
              <p className="text-xs text-white/50 mt-1">
                Photo: {selected.credit}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all duration-200 ${
                i === selectedIndex
                  ? "ring-2 ring-[var(--color-accent)] opacity-100"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText || img.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
