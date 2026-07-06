import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Děkujeme",
  description:
    "Vaše objednávka byla přijata. Následující den vytiskneme a odešleme váš pohled poštou.",
  noIndex: true,
});

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function ThankYouPage({ searchParams }: PageProps) {
  const { session_id } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <span className="text-5xl" role="img" aria-label="Srdce">❤️</span>
      <h1 className="mt-6 font-serif text-3xl">Děkujeme</h1>
      <p className="mt-4 text-muted-foreground">
        Váš pohled jsme přijali. Následující den jej vytiskneme a odešleme poštou.
      </p>
      {session_id && (
        <p className="mt-2 text-sm text-muted-foreground">
          Potvrzení jsme odeslali na Váš e-mail.
        </p>
      )}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="outline">
          <Link href="/objednavky">Moje objednávky</Link>
        </Button>
        <Button asChild>
          <Link href="/pohledy">Napsat další pohled</Link>
        </Button>
      </div>
    </div>
  );
}
