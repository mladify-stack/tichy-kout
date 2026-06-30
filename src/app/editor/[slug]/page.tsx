import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { PostcardEditor } from "@/components/postcard/postcard-editor";
import { createMetadata } from "@/lib/seo";
import { POSTCARD_PRICE_CENTS } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const postcard = await prisma.postcard.findUnique({ where: { slug } });
  if (!postcard) return createMetadata({ title: "Pohled nenalezen" });
  return createMetadata({
    title: `Napiš pohled — ${postcard.name}`,
    description: postcard.description ?? undefined,
    path: `/editor/${slug}`,
  });
}

export default async function EditorPage({ params }: PageProps) {
  const { slug } = await params;
  const postcard = await prisma.postcard.findUnique({
    where: { slug, isActive: true },
  });

  if (!postcard) notFound();

  return (
    <div className="py-8">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h1 className="font-serif text-2xl sm:text-3xl">Napiš pohled</h1>
        <p className="mt-2 text-muted-foreground">
          Vezměte si čas. Slova můžete kdykoli upravit.
        </p>
      </div>
      <PostcardEditor
        postcardId={postcard.id}
        postcardSlug={postcard.slug}
        postcardName={postcard.name}
        imageUrl={postcard.imageUrl}
        priceCents={POSTCARD_PRICE_CENTS}
      />
    </div>
  );
}
