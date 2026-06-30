import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Jak to funguje",
  description: "Vyberte pohled, napište vzkaz a my ho vytiskneme a odešleme poštou.",
  path: "/jak-to-funguje",
});

const steps = [
  {
    title: "Vyber pohled",
    description:
      "Projděte galerii klidných ilustrací — les, hory, moře, káva nebo minimalismus. Každý pohled je navržen tak, aby doplnil váš vzkaz, ne aby ho přebil.",
  },
  {
    title: "Napiš vzkaz",
    description:
      "V editoru napíšete text, vyberete písmo a podpis. Můžete využít AI pomocníka pro inspiraci — nebo napsat vše sami, vlastními slovy.",
  },
  {
    title: "Náhled a klid",
    description:
      "Nejdříve uvidíte, jak pohled vypadá. Platba přijde až ve chvíli, kdy budete spokojeni. Žádný spěch.",
  },
  {
    title: "My vytiskneme a odešleme",
    description:
      "Pohled vytiskneme na kvalitní papír a odešleme poštou na adresu, kterou zadáte. Vy dostanete potvrzení e-mailem.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl sm:text-4xl">Jak to funguje</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Jednoduše. Klidně. Bez zbytečných kroků.
      </p>

      <ol className="mt-12 space-y-10">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-6">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sage-300 font-serif text-sage-600"
              aria-hidden
            >
              {i + 1}
            </span>
            <div>
              <h2 className="font-serif text-xl">{step.title}</h2>
              <p className="mt-2 text-muted-foreground">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
