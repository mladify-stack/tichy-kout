"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { PostcardDoublePreview } from "./postcard-double-preview";
import { CustomPhotoUpload } from "./custom-photo-upload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { usePostcardDraft } from "@/hooks/use-postcard-draft";
import { messageSchema, type MessageFormData } from "@/lib/validations";
import {
  MAX_MESSAGE_LENGTH,
  TEXT_COLOR_OPTIONS,
  AI_CATEGORIES,
  formatPrice,
  formatRemainingChars,
  POSTCARD_PRICE_CENTS,
} from "@/lib/utils";
import type { TextColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PostcardEditorProps {
  postcardId: string;
  postcardSlug: string;
  postcardName: string;
  imageUrl: string;
  priceCents: number;
  isCustomPhoto?: boolean;
}

type EditorStep = "upload" | "edit" | "preparing" | "ready";

export function PostcardEditor({
  postcardId,
  postcardSlug,
  postcardName,
  imageUrl,
  isCustomPhoto = false,
}: PostcardEditorProps) {
  const router = useRouter();
  const { draft, setDraft } = usePostcardDraft();
  const hasCustomImage =
    isCustomPhoto &&
    draft.postcardId === postcardId &&
    Boolean(draft.customImageData);
  const [step, setStep] = useState<EditorStep>(
    isCustomPhoto && !hasCustomImage ? "upload" : "edit"
  );
  const [aiLoading, setAiLoading] = useState(false);
  const [aiCategory, setAiCategory] = useState<string | null>(null);

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      postcardId,
      message: draft.postcardId === postcardId ? draft.message : "",
      signature: draft.postcardId === postcardId ? draft.signature ?? "" : "",
      textColor:
        draft.postcardId === postcardId ? draft.textColor : "BLUE",
    },
  });

  const message = form.watch("message");
  const signature = form.watch("signature");
  const textColor = form.watch("textColor");
  const remaining = MAX_MESSAGE_LENGTH - message.length;

  const displayImageUrl =
    isCustomPhoto && draft.customImageData
      ? draft.customImageData
      : draft.postcardId === postcardId
        ? draft.imageUrl
        : imageUrl;

  const syncDraft = (data: Partial<MessageFormData>) => {
    setDraft({
      postcardId,
      postcardSlug,
      postcardName,
      imageUrl: displayImageUrl,
      priceCents: POSTCARD_PRICE_CENTS,
      message: data.message ?? message,
      signature: data.signature ?? signature ?? "",
      textColor: (data.textColor ?? textColor) as TextColor,
      isCustomPhoto,
      customImageData: isCustomPhoto ? draft.customImageData : undefined,
    });
  };

  const handlePhotoUploaded = (dataUrl: string) => {
    setDraft({
      postcardId,
      postcardSlug,
      postcardName,
      imageUrl: dataUrl,
      message: draft.postcardId === postcardId ? draft.message : "",
      signature: draft.postcardId === postcardId ? draft.signature : "",
      textColor: draft.postcardId === postcardId ? draft.textColor : "BLUE",
      priceCents: POSTCARD_PRICE_CENTS,
      isCustomPhoto: true,
      customImageData: dataUrl,
    });
    setStep("edit");
  };

  const handleAiSuggest = async (category: string) => {
    setAiCategory(category);
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });
      if (res.ok) {
        const { text } = await res.json();
        const trimmed = text.slice(0, MAX_MESSAGE_LENGTH);
        form.setValue("message", trimmed, { shouldValidate: true });
        syncDraft({ message: trimmed });
      }
    } finally {
      setAiLoading(false);
      setAiCategory(null);
    }
  };

  const onSubmit = async (data: MessageFormData) => {
    syncDraft(data);
    setStep("preparing");
    await new Promise((r) => setTimeout(r, 2500));
    setStep("ready");
  };

  const handleSend = () => {
    router.push("/kosik");
  };

  const previewProps = {
    imageUrl: displayImageUrl,
    message,
    signature,
    textColor,
  };

  if (step === "upload") {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <h2 className="font-serif text-2xl">Vlastní fotka</h2>
        <p className="mt-2 text-muted-foreground">
          Nahrajte fotku, která bude na přední straně pohledu.
        </p>
        <CustomPhotoUpload
          className="mt-8"
          onUploaded={handlePhotoUploaded}
        />
      </div>
    );
  }

  if (step === "preparing" || step === "ready") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <AnimatePresence mode="wait">
          {step === "preparing" && (
            <motion.div
              key="preparing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <Loader2 className="h-8 w-8 animate-spin text-sage-500" aria-hidden />
              <p className="font-serif text-2xl text-foreground">
                Připravujeme váš pohled…
              </p>
              <PostcardDoublePreview {...previewProps} size="md" />
            </motion.div>
          )}
          {step === "ready" && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex max-w-lg flex-col items-center gap-8"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="text-5xl"
                role="img"
                aria-label="Srdce"
              >
                ❤️
              </motion.span>
              <h2 className="font-serif text-3xl">Váš pohled je připraven.</h2>
              <PostcardDoublePreview {...previewProps} size="lg" />
              <p className="text-muted-foreground">
                Až budete připraveni, odešleme ho poštou někomu, na kom vám záleží.
              </p>
              <Button size="lg" onClick={handleSend} className="min-w-[200px]">
                Odeslat za {formatPrice(POSTCARD_PRICE_CENTS)}
              </Button>
              <button
                type="button"
                onClick={() => setStep("edit")}
                className="text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                Upravit vzkaz
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-2 lg:gap-12 lg:px-6">
      <div className="flex flex-col items-center lg:sticky lg:top-24 lg:self-start">
        <PostcardDoublePreview {...previewProps} size="lg" />
        <p className="mt-4 text-sm text-muted-foreground">{postcardName}</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="message">Váš vzkaz</Label>
          <Textarea
            id="message"
            maxLength={MAX_MESSAGE_LENGTH}
            {...form.register("message", {
              onChange: (e) => syncDraft({ message: e.target.value }),
            })}
            placeholder="Napište, co chcete říct…"
            className={cn(
              "mt-2 min-h-[200px] font-handwriting text-base leading-relaxed",
              TEXT_COLOR_OPTIONS.find((c) => c.value === textColor)?.className
            )}
            aria-describedby="char-count message-error"
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span id="char-count" aria-live="polite">
              {formatRemainingChars(Math.max(0, remaining))}
            </span>
            {form.formState.errors.message && (
              <span id="message-error" className="text-destructive" role="alert">
                {form.formState.errors.message.message}
              </span>
            )}
          </div>
        </div>

        <div>
          <Label>Barva textu</Label>
          <div className="mt-2 flex gap-3" role="radiogroup" aria-label="Barva textu">
            {TEXT_COLOR_OPTIONS.map((color) => (
              <button
                key={color.value}
                type="button"
                role="radio"
                aria-checked={textColor === color.value}
                onClick={() => {
                  form.setValue("textColor", color.value);
                  syncDraft({ textColor: color.value });
                }}
                className={cn(
                  "h-9 w-9 rounded-full border-2 transition-transform hover:scale-105",
                  textColor === color.value
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-transparent"
                )}
                style={{ backgroundColor: color.swatch }}
                title={color.label}
              />
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border/60 bg-warm-50/50 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-sage-500" aria-hidden />
            Pomoci s textem
          </div>
          <div className="flex flex-wrap gap-2">
            {AI_CATEGORIES.map((cat) => (
              <Button
                key={cat.value}
                type="button"
                variant="outline"
                size="sm"
                disabled={aiLoading}
                onClick={() => handleAiSuggest(cat.value)}
                className={cn(aiCategory === cat.value && "border-primary")}
              >
                {aiLoading && aiCategory === cat.value ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : null}
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="signature">Podpis</Label>
          <Input
            id="signature"
            {...form.register("signature", {
              onChange: (e) => syncDraft({ signature: e.target.value }),
            })}
            placeholder="Vaše jméno nebo přezdívka"
            className="mt-2 font-handwriting"
          />
        </div>

        {isCustomPhoto && (
          <button
            type="button"
            onClick={() => setStep("upload")}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Změnit fotku
          </button>
        )}

        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Zobrazit náhled
        </Button>
      </form>
    </div>
  );
}
