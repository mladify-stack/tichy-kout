import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { createMetadata } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";

export const metadata = createMetadata({
  title: "Vyber pohled",
  description: "Prohlédněte si naši galerii klidných pohledů — les, hory, moře a další.",
});

export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<{ kategorie?: string }>;
}

export default async function PostcardsPage({ searchParams }: PageProps) {
  const { kategorie } = await searchParams;

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      postcards: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  const activeCategory = kategorie
    ? categories.find((c) => c.slug === kategorie)
    : null;

  const postcards = activeCategory
    ? activeCategory.postcards
    : categories.flatMap((c) => c.postcards);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl">Vyber pohled</h1>
        <p className="mt-3 text-muted-foreground">
          Klidná ilustrace pro váš vzkaz
        </p>
      </header>

      {/* Kategorie */}
      <nav aria-label="Kategorie pohledů" className="mb-10">
        <ul className="flex flex-wrap justify-center gap-2">
          <li>
            <Link
              href="/pohledy"
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                !kategorie
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              Vše
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/pohledy?kategorie=${cat.slug}`}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  kategorie === cat.slug
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Galerie */}
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {postcards.map((postcard) => (
          <li key={postcard.id}>
            <Link
              href={`/editor/${postcard.slug}`}
              className="group block overflow-hidden rounded-lg border border-border/60 bg-card transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={postcard.thumbnailUrl ?? postcard.imageUrl}
                  alt={postcard.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h2 className="font-serif text-lg">{postcard.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatPrice(postcard.priceCents)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {postcards.length === 0 && (
        <p className="text-center text-muted-foreground">
          V této kategorii zatím nejsou žádné pohledy.
        </p>
      )}
    </div>
  );
}
