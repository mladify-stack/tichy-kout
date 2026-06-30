import Link from "next/link";
import { Menu, X } from "lucide-react";
import { APP_NAME } from "@/lib/utils";
import { HeaderNav } from "./header-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-serif text-xl tracking-wide text-foreground transition-opacity hover:opacity-70"
          aria-label={`${APP_NAME} — domů`}
        >
          {APP_NAME}
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}

export { Menu, X };
