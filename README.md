# Tichý kout

Moderní webová aplikace pro psaní a odesílání tištěných pohledů poštou.

**Doména:** [tichy-kout.cz](https://tichy-kout.cz)

## Stack

- **Next.js 15** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Prisma** + **PostgreSQL**
- **NextAuth** (přihlášení)
- **Stripe** (platby)
- **Resend** (e-maily)
- **Framer Motion** (animace)
- **React Hook Form** + **Zod** (validace)

## Požadavky

- Node.js 20+
- PostgreSQL databáze (doporučeno [Neon](https://neon.tech) nebo [Supabase](https://supabase.com))
- Účty: Stripe, Resend

## Instalace

```bash
git clone <repo-url> tichy-kout
cd tichy-kout
npm install
cp .env.example .env
# Vyplňte .env
npm run db:push
npm run db:seed
npm run dev
```

Aplikace běží na [http://localhost:3000](http://localhost:3000).

## Proměnné prostředí

| Proměnná | Popis |
|----------|-------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | URL aplikace (např. `https://tichy-kout.cz`) |
| `NEXTAUTH_SECRET` | Tajný klíč — `openssl rand -base64 32` |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `RESEND_API_KEY` | Resend API klíč |
| `EMAIL_FROM` | Odesílatel e-mailů |
| `NEXT_PUBLIC_APP_URL` | Veřejná URL aplikace |
| `ADMIN_EMAILS` | E-maily administrátorů (oddělené čárkou) |
| `OPENAI_API_KEY` | Volitelné — AI pomocník (jinak šablony) |

## Skripty

| Příkaz | Popis |
|--------|-------|
| `npm run dev` | Vývojový server |
| `npm run build` | Produkční build |
| `npm run start` | Spuštění produkce |
| `npm run db:push` | Sync schéma do DB |
| `npm run db:migrate` | Migrace |
| `npm run db:seed` | Naplnění pohledů a admin účtu |

### Výchozí admin (po seedu)

- **E-mail:** `admin@tichy-kout.cz`
- **Heslo:** `TichyKout2024!` — **změňte ihned po nasazení**

## Struktura projektu

```
src/
├── app/                    # Stránky (App Router)
│   ├── page.tsx            # Domů
│   ├── pohledy/            # Galerie
│   ├── editor/[slug]/      # Editor pohledu
│   ├── kosik/              # Košík + adresa
│   ├── platba/dekujeme/    # Po zaplacení
│   ├── admin/              # Administrace
│   ├── api/                # API endpointy
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                 # shadcn komponenty
│   ├── layout/             # Header, Footer
│   └── postcard/           # Preview, Editor
├── hooks/                  # usePostcardDraft
├── lib/                    # Prisma, auth, stripe, validace
└── types/
prisma/
├── schema.prisma
└── seed.ts
```

## UX tok (psychologie)

1. Vyber ilustraci → `/pohledy`
2. Editor → napiš text, písmo, podpis
3. Náhled + animace „Připravujeme váš pohled…"
4. Teprve poté nabídka platby → `/kosik`
5. Stripe Checkout → děkovná stránka + e-mail

## Nasazení na tichy-kout.cz

### Důležité: Český hosting vs. Next.js

Panel na **cesky-hosting.cz** (FTP, PHP, MySQL) **neumí** spustit Next.js 15 s PostgreSQL. Doménu tam máte správně — aplikaci hostujte jinde a doménu nasměrujte.

**Doporučené řešení:**

| Služba | Účel | Cena |
|--------|------|------|
| [Vercel](https://vercel.com) | Hosting Next.js | Zdarma tier |
| [Neon](https://neon.tech) | PostgreSQL | Zdarma tier |
| cesky-hosting.cz | Doména + e-mail | Už máte |

### Kroky nasazení (Vercel)

1. **GitHub** — nahrajte projekt do repozitáře
2. **Neon** — vytvořte PostgreSQL, zkopírujte `DATABASE_URL`
3. **Vercel** — Import projektu, nastavte env proměnné z `.env.example`
4. **Stripe** — Webhook na `https://tichy-kout.cz/api/webhooks/stripe`
5. **Resend** — Ověřte doménu `tichy-kout.cz` pro odesílání e-mailů
6. **Migrace:** Vercel build spustí `prisma generate`; po deployu spusťte seed:

```bash
npx prisma db push
npx prisma db seed
```

7. **DNS na cesky-hosting.cz** (záložka DNS):
   - Typ **A** nebo **CNAME** dle instrukcí Vercel
   - Typicky: `CNAME` `@` → `cname.vercel-dns.com`
   - Nebo `A` záznam na IP Vercel

8. **HTTPS** — Vercel automaticky (Let's Encrypt). V panelu Českého hostingu můžete vypnout jejich HTTPS proxy, pokud ukazuje na Vercel.

### E-mail na Českém hostingu

E-maily (`info@tichy-kout.cz`) nechte u Českého hostingu — nastavte SPF/DKIM dle jejich návodu. Resend pro transakční e-maily vyžaduje vlastní DNS záznamy.

## Stripe webhook (lokálně)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Bezpečnost

- Rate limiting na API
- Validace Zod na všech formulářích
- Sanitizace textových vstupů
- Security headers (middleware)
- Admin routes chráněné JWT + rolí

## Přístupnost

- WCAG AA — focus stavy, ARIA labely
- Klávesová navigace
- Sémantické HTML

## Licence

Proprietární — Tichý kout © 2025
