import type { AiTextCategory } from "@prisma/client";

/** Template-based AI text suggestions — works without OpenAI */
const TEMPLATES: Record<AiTextCategory, string[]> = {
  PODĚKOVÁNÍ: [
    "Chtěla jsem ti jen říct, jak moc si vážím toho, že jsi tu. Děkuji za každý malý okamžik, který jsme sdíleli.",
    "Někdy slova nestačí — ale stejně je chci napsat. Děkuji ti za všechno, co děláš, i když to možná nevidíš.",
    "Za tvou trpělivost, za tvůj smích, za to, že jsi. Děkuji.",
  ],
  POVZBUZENÍ: [
    "Vím, že teď není snadné. Ale věřím v tebe — v to, kdo jsi, a v to, kam směřuješ.",
    "Každý den je nová stránka. Dnes může být klidnější než včera — a to stačí.",
    "Nejsi na to sama. A i když ano — zvládneš to. Krok po kroku.",
  ],
  LÁSKA: [
    "Miluji tě — ne za to, co děláš, ale za to, kdo jsi. Prostě za tebe.",
    "Když myslím na domov, myslím na tebe. Tam, kde jsi ty, je mi dobře.",
    "Někdy stačí být spolu. Bez slov. Ale dnes chci napsat: jsi můj nejkrásnější den.",
  ],
  OMLOUVA: [
    "Vím, že jsem udělal chybu. Nechci se vymlouvat — chci se omluvit. Upřímně.",
    "Lituji slov, která jsem řekl. Zasloužíš si víc než můj spěch a netrpělivost.",
    "Omlouvám se. Ne proto, že musím — ale proto, že mi na tobě záleží.",
  ],
  VZPOMÍNKA: [
    "Vzpomínám na ten den — na slunce, na smích, na to, jak jsme byli prostě spolu. Chybí mi to.",
    "Některé chvíle nezmizí. Zůstávají v srdci jako teplý papír v kapse.",
    "Minulost není pryč. Žije v nás — v každém podzimním listí, v každé vzpomínce na tebe.",
  ],
  JEN_TAK: [
    "Jen jsem si vzpomněl na tebe. Bez důvodu. A udělalo mi to radost.",
    "Dnes je klidný den. A chtěl jsem ti poslat kousek toho klidu.",
    "Někdy stačí pár vět. Tady jsou moje — pro tebe.",
  ],
};

export async function generateAiText(
  category: AiTextCategory,
  context?: string
): Promise<string> {
  // Optional OpenAI integration
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Jsi citlivý autor krátkých vzkazů na pohledy. Piš česky, klidně, bez klišé. Max 3 věty. Bez uvozovek.",
            },
            {
              role: "user",
              content: `Napiš vzkaz kategorie ${category}.${context ? ` Kontext: ${context}` : ""}`,
            },
          ],
          max_tokens: 200,
          temperature: 0.8,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) return text;
      }
    } catch {
      // Fall through to templates
    }
  }

  const options = TEMPLATES[category];
  return options[Math.floor(Math.random() * options.length)] ?? options[0];
}
