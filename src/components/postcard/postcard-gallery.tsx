"use client";

import Link from "next/link";
import { PostcardImage } from "@/components/postcard/postcard-image";
import { formatPrice, POSTCARD_PRICE_CENTS } from "@/lib/utils";

export interface GalleryPostcard {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  thumbnailUrl: string | null;
  imageUrl: string;
}

interface PostcardGalleryProps {
  postcards: GalleryPostcard[];
}

export function PostcardGallery({ postcards }: PostcardGalleryProps) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {postcards.map((postcard) => (
        <li key={postcard.id}>
          <Link
            href={`/editor/${postcard.slug}`}
            className="group block overflow-hidden rounded-lg border border-border/60 bg-card transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="relative aspect-[3/2] overflow-hidden">
              <PostcardImage
                src={postcard.thumbnailUrl ?? postcard.imageUrl}
                alt={postcard.name}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h2 className="font-serif text-lg">{postcard.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatPrice(POSTCARD_PRICE_CENTS)}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
