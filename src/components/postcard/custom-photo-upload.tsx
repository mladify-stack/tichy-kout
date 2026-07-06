"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_WIDTH = 2000;
const JPEG_QUALITY = 0.88;

/** Zmenší fotku pro uložení do objednávky (data URL) */
async function compressImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas není dostupný");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
  return canvas.toDataURL(mime, JPEG_QUALITY);
}

interface CustomPhotoUploadProps {
  onUploaded: (dataUrl: string) => void;
  currentPreview?: string;
  className?: string;
}

export function CustomPhotoUpload({
  onUploaded,
  currentPreview,
  className,
}: CustomPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentPreview ?? null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Použijte JPG, PNG nebo WebP.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError("Fotka je příliš velká (max. 8 MB).");
        return;
      }

      setLoading(true);
      try {
        const dataUrl = await compressImage(file);
        setPreview(dataUrl);
        onUploaded(dataUrl);
      } catch {
        setError("Fotku se nepodařilo zpracovat. Zkuste jiný soubor.");
      } finally {
        setLoading(false);
      }
    },
    [onUploaded]
  );

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div
        className={cn(
          "relative aspect-[3/2] w-full max-w-md overflow-hidden rounded-lg border-2 border-dashed border-border bg-warm-50/50",
          preview && "border-solid border-border/60"
        )}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Náhled vlastní fotky"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-muted-foreground">
            <ImageIcon className="h-10 w-10 opacity-40" aria-hidden />
            <p className="text-sm">
              Nahrajte vlastní fotku na líc pohledu
            </p>
            <p className="text-xs">Nejlepší je horizontální snímek (na šířku)</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button
        type="button"
        variant={preview ? "outline" : "default"}
        size="lg"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" aria-hidden />
        {loading
          ? "Zpracovávám…"
          : preview
            ? "Nahrát jinou fotku"
            : "Vybrat fotku z počítače"}
      </Button>
    </div>
  );
}

/** Stáhnutí obrázku z URL nebo data URL */
export function downloadImage(
  src: string,
  filename: string
): void {
  const link = document.createElement("a");
  link.href = src;
  link.download = filename;
  if (src.startsWith("http")) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
