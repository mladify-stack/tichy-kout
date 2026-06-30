import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes without conflicts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format price in Czech crowns from cents */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/** Generate unique order number: TK-YYYYMMDD-XXXX */
export function generateOrderNumber(): string {
  const date = new Date();
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TK-${datePart}-${random}`;
}

/** Sanitize user text input — strip HTML tags */
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "…";
}

/** App constants */
export const APP_NAME = "Tichý kout";
export const APP_DESCRIPTION =
  "Napište krásný pohled někomu, na kom vám záleží. My jej vytiskneme a fyzicky odešleme poštou.";
export const MAX_MESSAGE_LENGTH = 500;
export const POSTCARD_PRICE_CENTS =
  Number(process.env.NEXT_PUBLIC_POSTCARD_PRICE) || 8900;
/** Poštovné je zahrnuto v ceně pohledu */
export const SHIPPING_PRICE_CENTS = 0;

export const FONT_OPTIONS = [
  { value: "HANDWRITING", label: "Rukopis", className: "font-handwriting" },
  { value: "SERIF", label: "Klasické", className: "font-serif" },
  { value: "SANS", label: "Jednoduché", className: "font-sans" },
  { value: "ELEGANT", label: "Elegantní", className: "font-elegant" },
] as const;

export const ALIGNMENT_OPTIONS = [
  { value: "LEFT", label: "Vlevo" },
  { value: "CENTER", label: "Na střed" },
  { value: "RIGHT", label: "Vpravo" },
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Koncept",
  NEW: "Nová",
  PAID: "Zaplacená",
  PRINTED: "Vytištěná",
  SHIPPED: "Odeslaná",
  DELIVERED: "Doručená",
  CANCELLED: "Zrušená",
};

export const AI_CATEGORIES = [
  { value: "PODĚKOVÁNÍ", label: "Poděkování" },
  { value: "POVZBUZENÍ", label: "Povzbuzení" },
  { value: "LÁSKA", label: "Láska" },
  { value: "OMLOUVA", label: "Omluva" },
  { value: "VZPOMÍNKA", label: "Vzpomínka" },
  { value: "JEN_TAK", label: "Jen tak" },
] as const;
