import prisma from "@/lib/prisma";
import Link from "next/link";
import { PostcardGallery } from "@/components/postcard/postcard-gallery";
import { createMetadata } from "@/lib/seo";

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

      <PostcardGallery postcards={postcards} />

      {postcards.length === 0 && (
        <p className="text-center text-muted-foreground">
          V této kategorii zatím nejsou žádné pohledy.
        </p>
      )}
    </div>
  );
}
