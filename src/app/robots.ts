import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://tichy-kout.cz";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/ucet/", "/objednavky", "/kosik", "/platba/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
