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
  { slug: "kocky", name: "Kočky", sortOrder: 7 },
  { slug: "psi", name: "Psi", sortOrder: 8 },
  { slug: "knihy", name: "Knihy", sortOrder: 9 },
  { slug: "podzim", name: "Podzim", sortOrder: 10 },
  { slug: "zima", name: "Zima", sortOrder: 11 },
  { slug: "minimalismus", name: "Minimalismus", sortOrder: 12 },
];

const UNSPLASH: Record<string, string[]> = {
  les: [
    "photo-1448375240806-882854db8510",
    "photo-1511499767150-a48a237f0083",
    "photo-1476231682828-584084bb751e",
  ],
  hory: [
    "photo-1506905925346-21bda4d32df4",
    "photo-1464822759023-fed622ff2c3b",
    "photo-1454496526208-3075ebb8466e",
  ],
  more: [
    "photo-1505142468610-359e7d316be0",
    "photo-1439402097249-ccc46c79a705",
    "photo-1473496167767-52a2982720f2",
  ],
  louky: [
    "photo-1500382017468-904027fed7d3",
    "photo-1470071459604-3b5ec3a7fe05",
    "photo-1416879595882-3373a0480b5b",
  ],
  dest: [
    "photo-1428908728789-d2baa25b053f",
    "photo-1519692933481-1623690d4151",
    "photo-1534088568595-a066ff4103b5",
  ],
  kava: [
    "photo-1495474472287-4d71bcdd2085",
    "photo-1509042239860-f550ce710b93",
    "photo-1442512595331-e89e73853f31",
  ],
  kocky: [
    "photo-1514888286974-6c03e2ca1dba",
    "photo-1574158622682-e40e69881006",
    "photo-1518791841217-8f162f1e1131",
  ],
  psi: [
    "photo-1587300003388-59208cc962cb",
    "photo-1558787533-047468892f77",
    "photo-1530281700549-e82e7bf110d6",
  ],
  knihy: [
    "photo-1512820790809-52fbf9d35264",
    "photo-1481627834876-b7833e8f5570",
    "photo-1495446815901-a7297e633e8d",
  ],
  podzim: [
    "photo-1506905925346-21bda4d32df4",
    "photo-1507003211169-0a1dd7228f2d",
    "photo-1476820865390-c1334439096a",
  ],
  zima: [
    "photo-1491002057096-896379427357",
    "photo-1483664856837-173ec06659f1",
    "photo-1418985991508-e47386d96a71",
  ],
  minimalismus: [
    "photo-1494438639946-1ebd1d20bf85",
    "photo-1513694203232-c719c732763f",
    "photo-1528459804606-d0f5debb5371",
  ],
};

const NAMES: Record<string, string[]> = {
  les: ["Tichý les", "Ranní mlha", "Mezi stromy"],
  hory: ["Výhled", "Horský klid", "Na vrcholu"],
  more: ["Pobřeží", "Vlny", "Modrá dálka"],
  louky: ["Louka", "Pastvina", "Květinová louka"],
  dest: ["Déšť", "Kapky", "Po dešti"],
  kava: ["Ranní káva", "Odpočinek", "Teplý šálek"],
  kocky: ["Kočka v okně", "Spící kočka", "Měkké ticho"],
  psi: ["Věrný přítel", "Procházka", "Radost"],
  knihy: ["Otevřená kniha", "Večerní čtení", "Stránky"],
  podzim: ["Podzimní listí", "Zlatý podzim", "Chladný večer"],
  zima: ["Zimní ticho", "Sníh", "Mrazivé ráno"],
  minimalismus: ["Jednoduchost", "Prázdný prostor", "Klid"],
};

async function main() {
  console.log("Seeding database...");

  for (const cat of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, sortOrder: cat.sortOrder },
      create: cat,
    });

    const photos = UNSPLASH[cat.slug] ?? [];
    const names = NAMES[cat.slug] ?? ["Pohled"];

    for (let i = 0; i < photos.length; i++) {
      const photoId = photos[i];
      const slug = `${cat.slug}-${i + 1}`;
      const imageUrl = `https://images.unsplash.com/${photoId}?w=800&q=80&auto=format&fit=crop`;

      await prisma.postcard.upsert({
        where: { slug },
        update: {
          name: names[i] ?? `Pohled ${i + 1}`,
          imageUrl,
          thumbnailUrl: `${imageUrl}&w=400`,
          categoryId: category.id,
        },
        create: {
          slug,
          name: names[i] ?? `Pohled ${i + 1}`,
          description: `Klidný pohled — ${names[i]}`,
          imageUrl,
          thumbnailUrl: `${imageUrl}&w=400`,
          priceCents: 5900,
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
