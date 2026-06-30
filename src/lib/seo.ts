import type { Metadata } from "next";
import { APP_NAME, APP_DESCRIPTION } from "./utils";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://tichy-kout.cz";

interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

export function createMetadata({
  title,
  description = APP_DESCRIPTION,
  path = "",
  image = "/og-image.jpg",
  noIndex = false,
}: SeoProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${APP_NAME}` : APP_NAME;
  const url = `${baseUrl}${path}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(baseUrl),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: APP_NAME,
      locale: "cs_CZ",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: APP_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: APP_NAME,
    url: baseUrl,
    description: APP_DESCRIPTION,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "info@tichy-kout.cz",
      availableLanguage: "Czech",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: APP_NAME,
    url: baseUrl,
    description: APP_DESCRIPTION,
    inLanguage: "cs-CZ",
  };
}

export function productJsonLd(postcard: {
  name: string;
  description?: string | null;
  imageUrl: string;
  priceCents: number;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: postcard.name,
    description: postcard.description ?? APP_DESCRIPTION,
    image: postcard.imageUrl,
    url: `${baseUrl}/pohledy/${postcard.slug}`,
    offers: {
      "@type": "Offer",
      price: postcard.priceCents / 100,
      priceCurrency: "CZK",
      availability: "https://schema.org/InStock",
    },
  };
}
