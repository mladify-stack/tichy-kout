import Link from "next/link";
import { Upload } from "lucide-react";

export function CustomPhotoCard() {
  return (
    <div className="mb-10">
      <Link
        href="/editor/vlastni-fotka"
        className="group flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-primary/40 bg-warm-50/40 px-6 py-10 transition-colors hover:border-primary hover:bg-warm-50"
      >
        <Upload
          className="h-10 w-10 text-primary/70 transition-transform group-hover:scale-105"
          aria-hidden
        />
        <div className="text-center">
          <h2 className="font-serif text-xl">Vlastní fotka</h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Žádný pohled vám nesedí? Nahrajte vlastní snímek — třeba rodinnou
            fotku nebo oblíbené místo.
          </p>
        </div>
      </Link>
    </div>
  );
}
