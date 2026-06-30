import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://tichy-kout.cz";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "",
    "/jak-to-funguje",
    "/pohledy",
    "/kontakt",
    "/obchodni-podminky",
    "/gdpr",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  let postcardPages: MetadataRoute.Sitemap = [];
  try {
    const postcards = await prisma.postcard.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });
    postcardPages = postcards.map((p) => ({
      url: `${baseUrl}/editor/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // DB not available at build time
  }

  return [...staticPages, ...postcardPages];
}
