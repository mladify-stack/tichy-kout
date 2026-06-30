import Link from "next/link";
import { APP_NAME } from "@/lib/utils";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/60 bg-warm-50/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-serif text-lg">{APP_NAME}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Místo, kam přijdete na chvíli zpomalit.
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium">Navigace</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/pohledy" className="hover:text-foreground">Vyber pohled</Link></li>
              <li><Link href="/jak-to-funguje" className="hover:text-foreground">Jak to funguje</Link></li>
              <li><Link href="/kontakt" className="hover:text-foreground">Kontakt</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium">Účet</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/ucet" className="hover:text-foreground">Můj účet</Link></li>
              <li><Link href="/objednavky" className="hover:text-foreground">Moje objednávky</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium">Právní</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/obchodni-podminky" className="hover:text-foreground">Obchodní podmínky</Link></li>
              <li><Link href="/gdpr" className="hover:text-foreground">GDPR</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          © {year} {APP_NAME}. Všechna práva vyhrazena.
        </div>
      </div>
    </footer>
  );
}
