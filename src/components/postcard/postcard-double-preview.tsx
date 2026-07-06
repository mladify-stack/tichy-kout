"use client";

import { cn } from "@/lib/utils";
import {
  POSTCARD_MESSAGE_FONT,
  getTextColorClass,
} from "@/lib/utils";
import type { TextColor } from "@/lib/utils";
import { PostcardImage } from "./postcard-image";

export interface PostcardAddressPreview {
  salutation?: string;
  name?: string;
  street?: string;
  city?: string;
  postalCode?: string;
}

interface PostcardDoublePreviewProps {
  imageUrl: string;
  message: string;
  signature?: string | null;
  textColor?: TextColor | string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabels?: boolean;
  address?: PostcardAddressPreview;
}

import { BRAND_FOOTER_NOTE } from "@/lib/postcard-constants";

function PostcardBack({
  message,
  signature,
  textColor,
  size,
  address,
}: {
  message: string;
  signature?: string | null;
  textColor?: TextColor | string;
  size: "sm" | "md" | "lg";
  address?: PostcardAddressPreview;
}) {
  const colorClass = getTextColorClass(textColor);

  const textSize = {
    sm: "text-[8px]",
    md: "text-[10px]",
    lg: "text-[11px]",
  }[size];

  const addressSize = {
    sm: "text-[7px]",
    md: "text-[9px]",
    lg: "text-[10px]",
  }[size];

  const footerSize = {
    sm: "text-[6px]",
    md: "text-[7px]",
    lg: "text-[8px]",
  }[size];

  const stampSize = {
    sm: "h-[42%] w-[70%]",
    md: "h-[42%] w-[70%]",
    lg: "h-[42%] w-[68%]",
  }[size];

  const hasAddress = Boolean(
    address?.salutation ||
      address?.name ||
      address?.street ||
      address?.city ||
      address?.postalCode
  );

  const postalDigits = address?.postalCode?.replace(/\s/g, "") ?? "";

  return (
    <div className="absolute inset-0 flex bg-white">
      {/* Levá polovina — vzkaz (jako v aplikaci České pošty) */}
      <div className="flex min-w-0 flex-1 flex-col border-r border-sage-300/60 p-2 sm:p-2.5">
        <div className="min-h-0 flex-1 overflow-hidden text-left">
          <p
            className={cn(
              "whitespace-pre-wrap leading-[1.35]",
              POSTCARD_MESSAGE_FONT,
              textSize,
              colorClass
            )}
          >
            {message || "Váš vzkaz se objeví zde…"}
          </p>
          {signature && (
            <p
              className={cn(
                "mt-1",
                POSTCARD_MESSAGE_FONT,
                textSize,
                colorClass
              )}
            >
              — {signature}
            </p>
          )}
        </div>
        <p
          className={cn(
            "mt-1 shrink-0 leading-tight text-sage-500 italic",
            footerSize
          )}
        >
          {BRAND_FOOTER_NOTE}
        </p>
      </div>

      {/* Pravá polovina — známka nahoře, adresa dole */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Známka */}
        <div className="flex flex-1 items-start justify-end border-b border-sage-300/60 p-2">
          <div
            className={cn(
              "rounded-sm border border-dashed border-sage-400/70 bg-sage-50/50",
              stampSize
            )}
            aria-hidden
          />
        </div>

        {/* Adresa — vzor České pošty */}
        <div className="flex flex-1 flex-col justify-end p-2 sm:p-2.5">
          {hasAddress ? (
            <address
              className={cn(
                "not-italic leading-[1.45] font-sans",
                addressSize,
                colorClass
              )}
            >
              {address?.salutation && <div>{address.salutation}</div>}
              {address?.name && <div>{address.name}</div>}
              {address?.street && <div>{address.street}</div>}
              {postalDigits && <div>{postalDigits}</div>}
              {address?.city && <div>{address.city}</div>}
            </address>
          ) : (
            <div className="space-y-1.5" aria-hidden>
              {[0, 1, 2, 3, 4].map((line) => (
                <div
                  key={line}
                  className={cn(
                    "border-b border-sage-300/45",
                    size === "lg" ? "h-2.5" : "h-2"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Náhled pohledu — líc (obrázek) a rub (text vlevo, adresa vpravo) */
export function PostcardDoublePreview({
  imageUrl,
  message,
  signature,
  textColor = "BLUE",
  size = "md",
  className,
  showLabels = true,
  address,
}: PostcardDoublePreviewProps) {
  const cardWidth = {
    sm: "w-[160px]",
    md: "w-[240px]",
    lg: "w-[320px]",
  }[size];

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="flex flex-wrap items-start justify-center gap-4 sm:gap-6">
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
              sizes="320px"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          {showLabels && (
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Rub
            </span>
          )}
          <div
            className={cn(
              "relative aspect-[3/2] overflow-hidden rounded-md border border-border/60 shadow-md",
              cardWidth
            )}
          >
            <PostcardBack
              message={message}
              signature={signature}
              textColor={textColor}
              size={size}
              address={address}
            />
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
