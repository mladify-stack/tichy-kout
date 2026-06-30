import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-serif text-4xl">404</h1>
      <p className="mt-4 text-muted-foreground">
        Tato stránka neexistuje — možná se ztratila v tichu.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Zpět domů</Link>
      </Button>
    </div>
  );
}
