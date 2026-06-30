"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/jak-to-funguje", label: "Jak to funguje" },
  { href: "/pohledy", label: "Vyber pohled" },
  { href: "/kosik", label: "Košík" },
  { href: "/kontakt", label: "Kontakt" },
];

export function HeaderNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="hidden items-center gap-6 md:flex" aria-label="Hlavní navigace">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm transition-colors hover:text-primary",
              pathname === link.href
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/ucet"
          className="text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          Můj účet
        </Link>
        <Button asChild size="sm">
          <Link href="/pohledy">Napsat pohled</Link>
        </Button>
      </nav>

      <button
        type="button"
        className="md:hidden"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Zavřít menu" : "Otevřít menu"}
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <nav
          className="absolute left-0 right-0 top-16 border-b border-border bg-background p-4 md:hidden"
          aria-label="Mobilní navigace"
        >
          <ul className="flex flex-col gap-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 text-sm"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/ucet" className="block py-2 text-sm" onClick={() => setOpen(false)}>
                Můj účet
              </Link>
            </li>
            <li>
              <Button asChild className="w-full">
                <Link href="/pohledy" onClick={() => setOpen(false)}>
                  Napsat pohled
                </Link>
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}
