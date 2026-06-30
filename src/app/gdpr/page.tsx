import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Ochrana osobních údajů",
  path: "/gdpr",
});

export default function GdprPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl">Ochrana osobních údajů (GDPR)</h1>

      <section className="mt-8 space-y-4 text-sm text-muted-foreground">
        <h2 className="font-serif text-xl text-foreground">Správce údajů</h2>
        <p>
          Správcem osobních údajů je provozovatel služby Tichý kout, kontakt: info@tichy-kout.cz.
        </p>

        <h2 className="font-serif text-xl text-foreground">Jaké údaje zpracováváme</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Jméno a e-mail (objednávka, komunikace)</li>
          <li>Doručovací adresa</li>
          <li>Text pohledu a podpis (plnění smlouvy)</li>
          <li>Platební údaje (zpracovává Stripe, neukládáme čísla karet)</li>
        </ul>

        <h2 className="font-serif text-xl text-foreground">Účel zpracování</h2>
        <p>
          Údaje zpracováváme za účelem plnění smlouvy, odeslání pohledu, fakturace a
          zákaznické podpory. Marketingové e-maily zasíláme pouze se souhlasem.
        </p>

        <h2 className="font-serif text-xl text-foreground">Doba uchování</h2>
        <p>
          Objednávkové údaje uchováváme po dobu nezbytnou pro plnění zákonných povinností,
          nejdéle 10 let od dokončení objednávky.
        </p>

        <h2 className="font-serif text-xl text-foreground">Vaše práva</h2>
        <p>
          Máte právo na přístup, opravu, výmaz, omezení zpracování a přenositelnost údajů.
          Stížnost můžete podat u ÚOOÚ. Kontakt: info@tichy-kout.cz.
        </p>
      </section>
    </article>
  );
}
