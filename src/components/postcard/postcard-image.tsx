"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PostcardImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
}

/** Obrázek pohledu s klidným placeholderem, když soubor chybí */
export function PostcardImage({
  src,
  alt,
  className,
  sizes,
  priority,
  fill = true,
}: PostcardImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-sage-100 to-warm-100",
          fill && "absolute inset-0",
          className
        )}
        aria-label={alt}
      >
        <span className="px-4 text-center font-serif text-sm text-sage-500">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}
