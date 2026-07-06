import type { AiTextCategory } from "@prisma/client";

/** Vzkazy pro „Pomoci s textem“ — 3 varianty na kategorii */
const TEMPLATES: Record<AiTextCategory, string[]> = {
  PODĚKOVÁNÍ: [
    "Děkuju, že jsi tu byl, i když to nebylo zrovna snadné. Za obyčejné zprávy, trpělivost a chvíle, kdy nebylo potřeba moc mluvit. Vážím si toho víc, než umím říct.",
    "Jen ti chci nechat malé děkuju. Za tvoji laskavost, spolehlivost a klid, který s sebou neseš. Někdy stačí málo, aby to pro druhého znamenalo hodně.",
    "Děkuju za všechny ty malé věci, které se snadno přehlédnou. Za to, že si všímáš, že pomůžeš a že se dá o tebe opřít. Je v tom víc, než se na první pohled zdá.",
  ],
  POVZBUZENÍ: [
    "Jen připomínám, že nemusíš být pořád silná. Můžeš zpomalit, na chvíli si sednout a nabrat dech. Všechno nemusí být hotové hned.",
    "Posílám ti tichou podporu na dny, které se táhnou déle, než by měly.",
    "Možná teď nevidíš moc daleko, ale to nevadí. Stačí kousek cesty před sebou. Zbytek může přijít později.",
  ],
  LÁSKA: [
    "S tebou mám pocit domova i tam, kde zrovna žádný není. V obyčejných dnech, v tichu i v malých rituálech. To je pro mě láska, která drží.",
    "Když si v hlavě skládám místa, kam se ráda vracím, patříš mezi ně i ty. Možná právě proto, že s tebou nemusím nic předstírat. A to je vzácné.",
    "Některé vztahy nejsou hlučné, a přesto nesou hodně. Ten náš tak vnímám. A jsem za něj opravdu vděčná.",
  ],
  OMLOUVA: [
    "Omlouvám se za to, co jsem řekla. Nemělo to zaznít tak, jak zaznělo, a chápu, že to mohlo zůstat v hlavě déle, než bych si přála. Mrzí mě to.",
    "Vím, že jsem tě zklamala, a nechci kolem toho chodit opatrně jen proto, aby to bylo snazší mně. Nebylo to v pořádku. Je mi to líto.",
    "Mrzí mě, že jsem ti přidala starost nebo smutek tam, kde jsem měla být spíš oporou. Vím, že omluva sama o sobě všechno nespraví. Přesto jsem ti ji chtěla poslat upřímně a bez výmluv.",
  ],
  VZPOMÍNKA: [
    "Dnes mi vytanul jeden náš společný den a zůstal se mnou déle, než bývá zvykem. Tak ti ho aspoň posílám kousek zpátky. Bylo v něm dobře.",
    "Jen jsem ti chtěla poslat jednu vzpomínku, která se dnes ozvala. Má v sobě klid, smích a pocit, že bylo všechno na chvíli přesně tam, kde má být.",
    "Dnes se mi připomněla jedna naše vzpomínka a vykouzlila mi úsměv. Takové ty obyčejné chvíle, které člověk tehdy neplánuje, a přesto mu zůstanou pod kůží.",
  ],
  JEN_TAK: [
    "Posílám ti krátké připomenutí, že někde v průběhu dne na tebe někdo mile myslel. Nic víc, nic míň. Jen tichý pozdrav.",
    "Někdy není potřeba mít důvod, aby se člověk ozval. Stačí, že si na někoho vzpomene a chce mu udělat malou radost. Tak to dnes vyšlo na tebe.",
    "Tenhle vzkaz nemá žádnou velkou příležitost. Jen mi přišlo hezké na chvíli se zastavit a ozvat se ti.",
  ],
};

export async function generateAiText(
  category: AiTextCategory,
  context?: string
): Promise<string> {
  // Volitelná OpenAI integrace — pokud není klíč, použijí se šablony výše
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
                "Jsi citlivý autor krátkých vzkazů na pohledy pro značku Tichý kout. Piš česky, klidně, v ženském rodě, bez klišé. Max 3–5 vět. Bez uvozovek.",
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
