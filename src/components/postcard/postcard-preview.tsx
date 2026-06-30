"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { FONT_OPTIONS } from "@/lib/utils";

interface PostcardPreviewProps {
  imageUrl: string;
  message: string;
  signature?: string | null;
  fontFamily: string;
  textAlignment: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const alignmentMap = {
  LEFT: "text-left items-start",
  CENTER: "text-center items-center",
  RIGHT: "text-right items-end",
};

export function PostcardPreview({
  imageUrl,
  message,
  signature,
  fontFamily,
  textAlignment,
  className,
  size = "md",
}: PostcardPreviewProps) {
  const fontClass =
    FONT_OPTIONS.find((f) => f.value === fontFamily)?.className ??
    "font-handwriting";

  const sizeClasses = {
    sm: "max-w-[240px]",
    md: "max-w-[360px]",
    lg: "max-w-[480px]",
  };

  return (
    <div
      className={cn(
        "relative aspect-[3/2] overflow-hidden rounded-lg shadow-lg",
        sizeClasses[size],
        className
      )}
      role="img"
      aria-label="Náhled pohledu"
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 480px"
          priority={size === "lg"}
        />
      ) : (
        <div className="absolute inset-0 bg-sage-200" />
      )}
      <div className="absolute inset-0 bg-black/20" />
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-center px-6 py-4",
          alignmentMap[textAlignment as keyof typeof alignmentMap] ??
            alignmentMap.CENTER
        )}
      >
        <p
          className={cn(
            "whitespace-pre-wrap text-white drop-shadow-md",
            fontClass,
            size === "sm" ? "text-base" : size === "md" ? "text-lg" : "text-xl"
          )}
        >
          {message || "Váš vzkaz se objeví zde…"}
        </p>
        {signature && (
          <p
            className={cn(
              "mt-3 text-white/90 drop-shadow-md",
              fontClass,
              size === "sm" ? "text-sm" : "text-base"
            )}
          >
            — {signature}
          </p>
        )}
      </div>
    </div>
  );
}
