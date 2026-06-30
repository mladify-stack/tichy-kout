import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
  { slug: "les", name: "Les", sortOrder: 1 },
  { slug: "hory", name: "Hory", sortOrder: 2 },
  { slug: "more", name: "Moře", sortOrder: 3 },
  { slug: "louky", name: "Louky", sortOrder: 4 },
  { slug: "dest", name: "Déšť", sortOrder: 5 },
  { slug: "kava", name: "Káva", sortOrder: 6 },
  { slug: "nerdi", name: "Nerdi", sortOrder: 7 },
  { slug: "tichy-kout-special", name: "Tichý kout special", sortOrder: 8 },
  { slug: "knihy", name: "Knihy", sortOrder: 9 },
  { slug: "podzim", name: "Podzim", sortOrder: 10 },
  { slug: "zima", name: "Zima", sortOrder: 11 },
  { slug: "minimalismus", name: "Minimalismus", sortOrder: 12 },
];

const NAMES: Record<string, string[]> = {
  les: ["Tichý les", "Ranní mlha", "Mezi stromy"],
  hory: ["Výhled", "Horský klid", "Na vrcholu"],
  more: ["Pobřeží", "Vlny", "Modrá dálka"],
  louky: ["Louka", "Pastvina", "Květinová louka"],
  dest: ["Déšť", "Kapky", "Po dešti"],
  kava: ["Ranní káva", "Odpočinek", "Teplý šálek"],
  nerdi: ["Tiché čtení", "Večer u obrazovky", "Malé radosti"],
  "tichy-kout-special": ["Limitka", "Ruční práce", "Jen u nás"],
  knihy: ["Otevřená kniha", "Večerní čtení", "Stránky"],
  podzim: ["Podzimní listí", "Zlatý podzim", "Chladný večer"],
  zima: ["Zimní ticho", "Sníh", "Mrazivé ráno"],
  minimalismus: ["Jednoduchost", "Prázdný prostor", "Klid"],
};

async function main() {
  console.log("Seeding database...");

  // Odstranit staré kategorie Kočky / Psi
  const deprecated = await prisma.category.findMany({
    where: { slug: { in: ["kocky", "psi"] } },
    select: { id: true },
  });
  if (deprecated.length) {
    await prisma.postcard.deleteMany({
      where: { categoryId: { in: deprecated.map((c) => c.id) } },
    });
    await prisma.category.deleteMany({
      where: { slug: { in: ["kocky", "psi"] } },
    });
  }

  for (const cat of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, sortOrder: cat.sortOrder },
      create: cat,
    });

    const names = NAMES[cat.slug] ?? ["Pohled 1", "Pohled 2", "Pohled 3"];

    for (let i = 0; i < names.length; i++) {
      const slug = `${cat.slug}-${i + 1}`;
      const imageUrl = `/postcards/${slug}.png`;

      await prisma.postcard.upsert({
        where: { slug },
        update: {
          name: names[i] ?? `Pohled ${i + 1}`,
          imageUrl,
          thumbnailUrl: imageUrl,
          categoryId: category.id,
        },
        create: {
          slug,
          name: names[i] ?? `Pohled ${i + 1}`,
          description: `Klidný pohled — ${names[i]}`,
          imageUrl,
          thumbnailUrl: imageUrl,
          priceCents: 8900,
          categoryId: category.id,
          sortOrder: i,
        },
      });
    }
  }

  // Admin user (password: TichyKout2024!)
  const passwordHash = await bcrypt.hash("TichyKout2024!", 12);

  await prisma.user.upsert({
    where: { email: "admin@tichy-kout.cz" },
    update: { role: "ADMIN", passwordHash },
    create: {
      email: "admin@tichy-kout.cz",
      name: "Administrátor",
      role: "ADMIN",
      passwordHash,
    },
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
