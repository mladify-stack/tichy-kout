"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { PostcardPreview } from "@/components/postcard/postcard-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePostcardDraft } from "@/hooks/use-postcard-draft";
import { shippingSchema, type ShippingFormData } from "@/lib/validations";
import {
  formatPrice,
  POSTCARD_PRICE_CENTS,
  SHIPPING_PRICE_CENTS,
} from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const { draft, hasDraft, isLoaded } = usePostcardDraft();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { country: "CZ" },
  });

  const subtotal = draft.priceCents || POSTCARD_PRICE_CENTS;
  const shipping = SHIPPING_PRICE_CENTS;
  const total = subtotal + shipping;

  const onSubmit = async (data: ShippingFormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shipping: data,
          draft,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Chyba při platbě");

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Něco se pokazilo");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return null;

  if (!hasDraft) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-serif text-2xl">Košík je prázdný</h1>
        <p className="mt-3 text-muted-foreground">
          Nejdříve vytvořte svůj pohled.
        </p>
        <Button asChild className="mt-6">
          <Link href="/pohledy">Vybrat pohled</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl">Košík</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="flex justify-center">
          <PostcardPreview
            imageUrl={draft.imageUrl}
            message={draft.message}
            signature={draft.signature}
            fontFamily={draft.fontFamily}
            textAlignment={draft.textAlignment}
            size="md"
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shrnutí</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Pohled — {draft.postcardName}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Poštovné</span>
                <span>{formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-medium">
                <span>Celkem</span>
                <span>{formatPrice(total)}</span>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <h2 className="font-serif text-xl">Kam pohled doručíme?</h2>

            <div>
              <Label htmlFor="recipientName">Jméno příjemce</Label>
              <Input id="recipientName" {...form.register("recipientName")} className="mt-1" />
              {form.formState.errors.recipientName && (
                <p className="mt-1 text-xs text-destructive" role="alert">
                  {form.formState.errors.recipientName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="recipientEmail">Váš e-mail (pro potvrzení)</Label>
              <Input id="recipientEmail" type="email" {...form.register("recipientEmail")} className="mt-1" />
              {form.formState.errors.recipientEmail && (
                <p className="mt-1 text-xs text-destructive" role="alert">
                  {form.formState.errors.recipientEmail.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="street">Ulice a číslo</Label>
              <Input id="street" {...form.register("street")} className="mt-1" />
              {form.formState.errors.street && (
                <p className="mt-1 text-xs text-destructive" role="alert">
                  {form.formState.errors.street.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Město</Label>
                <Input id="city" {...form.register("city")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="postalCode">PSČ</Label>
                <Input id="postalCode" {...form.register("postalCode")} className="mt-1" placeholder="123 45" />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Telefon (volitelné)</Label>
              <Input id="phone" type="tel" {...form.register("phone")} className="mt-1" />
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">{error}</p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Přesměrování na platbu…" : "Zaplatit"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
