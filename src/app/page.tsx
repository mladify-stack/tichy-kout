import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Vstupte do ticha",
  description:
    "Napište krásný pohled někomu, na kom vám záleží. My jej vytiskneme a fyzicky odešleme poštou.",
});

const steps = [
  { number: "1", title: "Vyber pohled", description: "Klidná ilustrace, která vystihne váš vzkaz." },
  { number: "2", title: "Napiš vzkaz", description: "Slova, která jste dlouho chtěli říct." },
  { number: "3", title: "My jej vytiskneme a odešleme", description: "Fyzický pohled dorazí poštou." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
        <Image
          src="/postcards/hero.png"
          alt="Tichý les — místo pro zastavení"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" aria-hidden />
        <div className="relative z-10 mx-auto max-w-2xl px-4 text-center text-white">
          <h1 className="font-serif text-4xl font-normal leading-tight sm:text-5xl md:text-6xl text-balance animate-fade-in">
            Někdy stačí pár vět.
          </h1>
          <p className="mt-6 text-lg text-white/85 sm:text-xl animate-slide-up">
            Napište pohled. My ho vytiskneme a odešleme poštou.
          </p>
          <Button asChild size="lg" className="mt-10 bg-white text-sage-800 hover:bg-white/90">
            <Link href="/pohledy">
              Napsat pohled
              <ArrowRight className="ml-1" aria-hidden />
            </Link>
          </Button>
        </div>
      </section>

      {/* 3 kroky */}
      <section className="bg-warm-50/50 py-20" aria-labelledby="steps-heading">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 id="steps-heading" className="sr-only">
            Jak to funguje ve třech krocích
          </h2>
          <div className="grid gap-12 md:grid-cols-3">
            {steps.map((step) => (
              <article key={step.number} className="text-center">
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sage-300 font-serif text-sage-600"
                  aria-hidden
                >
                  {step.number}
                </span>
                <h3 className="mt-4 font-serif text-xl">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </article>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/jak-to-funguje"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Více o tom, jak to funguje →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
