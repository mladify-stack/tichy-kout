import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Obchodní podmínky",
  path: "/obchodni-podminky",
});

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 prose prose-sage">
      <h1 className="font-serif text-3xl">Obchodní podmínky</h1>
      <p className="text-muted-foreground">Platné od 1. 1. 2025</p>

      <section className="mt-8 space-y-4 text-sm text-muted-foreground">
        <h2 className="font-serif text-xl text-foreground">1. Úvodní ustanovení</h2>
        <p>
          Tyto obchodní podmínky upravují vztah mezi provozovatelem služby Tichý kout
          (dále „prodávající“) a zákazníkem při nákupu tištěných pohledů s vlastním textem.
        </p>

        <h2 className="font-serif text-xl text-foreground">2. Předmět smlouvy</h2>
        <p>
          Prodávající zajišťuje tisk pohledu dle výběru zákazníka a jeho doručení poštou
          na adresu uvedenou v objednávce. Cena pohledu a poštovné jsou uvedeny před dokončením platby.
        </p>

        <h2 className="font-serif text-xl text-foreground">3. Objednávka a platba</h2>
        <p>
          Objednávka vzniká dokončením platby prostřednictvím Stripe. Po zaplacení obdržíte
          potvrzení e-mailem. Prodávající si vyhrazuje právo odmítnout objednávku s nevhodným obsahem.
        </p>

        <h2 className="font-serif text-xl text-foreground">4. Dodání</h2>
        <p>
          Pohled bude vytištěn a odeslán do 5 pracovních dnů od přijetí platby.
          Doručení závisí na provozu České pošty.
        </p>

        <h2 className="font-serif text-xl text-foreground">5. Odstoupení od smlouvy</h2>
        <p>
          Vzhledem k personalizaci obsahu není možné od smlouvy odstoupit po zahájení tisku.
          V případě vadného plnění kontaktujte info@tichy-kout.cz.
        </p>

        <h2 className="font-serif text-xl text-foreground">6. Kontakt</h2>
        <p>
          E-mail: info@tichy-kout.cz
        </p>
      </section>
    </article>
  );
}
