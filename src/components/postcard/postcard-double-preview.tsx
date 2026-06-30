"use client";

import { cn } from "@/lib/utils";
import { FONT_OPTIONS } from "@/lib/utils";
import { PostcardImage } from "./postcard-image";

interface PostcardDoublePreviewProps {
  imageUrl: string;
  message: string;
  signature?: string | null;
  fontFamily: string;
  textAlignment: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabels?: boolean;
}

const alignmentMap = {
  LEFT: "text-left items-start",
  CENTER: "text-center items-center",
  RIGHT: "text-right items-end",
};

/** Náhled pohledu — líc (obrázek) a rub (text), jako skutečná pohlednice */
export function PostcardDoublePreview({
  imageUrl,
  message,
  signature,
  fontFamily,
  textAlignment,
  size = "md",
  className,
  showLabels = true,
}: PostcardDoublePreviewProps) {
  const fontClass =
    FONT_OPTIONS.find((f) => f.value === fontFamily)?.className ??
    "font-handwriting";

  const cardWidth = {
    sm: "w-[140px]",
    md: "w-[180px]",
    lg: "w-[220px]",
  }[size];

  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size];

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="flex flex-wrap items-start justify-center gap-4 sm:gap-6">
        {/* Líc — pouze fotografie */}
        <div className="flex flex-col items-center gap-2">
          {showLabels && (
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Líc
            </span>
          )}
          <div
            className={cn(
              "relative aspect-[3/2] overflow-hidden rounded-md border border-border/40 shadow-md",
              cardWidth
            )}
          >
            <PostcardImage
              src={imageUrl}
              alt="Přední strana pohledu"
              className="object-cover"
              sizes="220px"
            />
          </div>
        </div>

        {/* Rub — text na papíru */}
        <div className="flex flex-col items-center gap-2">
          {showLabels && (
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Rub
            </span>
          )}
          <div
            className={cn(
              "relative aspect-[3/2] overflow-hidden rounded-md border border-border/60 shadow-md bg-[#f7f3eb]",
              cardWidth
            )}
          >
            {/* Jemná linka jako okraj pohlednice */}
            <div className="absolute inset-2 rounded-sm border border-sage-200/80" aria-hidden />
            <div
              className={cn(
                "absolute inset-0 flex flex-col justify-center px-4 py-3",
                alignmentMap[textAlignment as keyof typeof alignmentMap] ??
                  alignmentMap.CENTER
              )}
            >
              <p
                className={cn(
                  "whitespace-pre-wrap text-sage-800 leading-relaxed",
                  fontClass,
                  textSize
                )}
              >
                {message || "Váš vzkaz se objeví zde…"}
              </p>
              {signature && (
                <p
                  className={cn(
                    "mt-2 text-sage-600",
                    fontClass,
                    size === "sm" ? "text-[10px]" : "text-sm"
                  )}
                >
                  — {signature}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Pouze líc — pro miniatury v adminu */
export function PostcardFrontOnly({
  imageUrl,
  alt,
  className,
}: {
  imageUrl: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[3/2] overflow-hidden rounded-md border border-border/40",
        className
      )}
    >
      <PostcardImage src={imageUrl} alt={alt} className="object-cover" sizes="320px" />
    </div>
  );
}
