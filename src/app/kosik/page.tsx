"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { PostcardDoublePreview } from "@/components/postcard/postcard-double-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePostcardDraft } from "@/hooks/use-postcard-draft";
import { shippingSchema, type ShippingFormData } from "@/lib/validations";
import { formatPrice, POSTCARD_PRICE_CENTS } from "@/lib/utils";

export default function CartPage() {
  const { draft, hasDraft, isLoaded } = usePostcardDraft();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { country: "CZ" },
  });

  const salutation = form.watch("salutation");
  const recipientName = form.watch("recipientName");
  const street = form.watch("street");
  const city = form.watch("city");
  const postalCode = form.watch("postalCode");

  const total = POSTCARD_PRICE_CENTS;

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
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl">Košík</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="flex justify-center lg:sticky lg:top-24 lg:self-start">
          <PostcardDoublePreview
            imageUrl={
              draft.customImageData && draft.isCustomPhoto
                ? draft.customImageData
                : draft.imageUrl
            }
            message={draft.message}
            signature={draft.signature}
            textColor={draft.textColor}
            size="lg"
            address={{
              salutation: salutation || undefined,
              name: recipientName || undefined,
              street: street || undefined,
              city: city || undefined,
              postalCode: postalCode || undefined,
            }}
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
                <span>{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Včetně tištění a poštovného
              </p>
              <div className="flex justify-between border-t border-border pt-2 font-medium">
                <span>Celkem</span>
                <span>{formatPrice(total)}</span>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <fieldset className="space-y-4">
              <legend className="font-serif text-xl">Adresát</legend>
              <p className="text-sm text-muted-foreground">
                Stejný vzor jako v aplikaci České pošty
              </p>

              <div>
                <Label htmlFor="salutation">Oslovení (nepovinné)</Label>
                <Input
                  id="salutation"
                  {...form.register("salutation")}
                  className="mt-1"
                  placeholder="Manželé"
                />
              </div>

              <div>
                <Label htmlFor="recipientName">Jméno a příjmení</Label>
                <Input
                  id="recipientName"
                  {...form.register("recipientName")}
                  className="mt-1"
                  placeholder="Vavřičkovi"
                />
                {form.formState.errors.recipientName && (
                  <p className="mt-1 text-xs text-destructive" role="alert">
                    {form.formState.errors.recipientName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="street">Ulice a číslo popisné</Label>
                <Input
                  id="street"
                  {...form.register("street")}
                  className="mt-1"
                  placeholder="Družstevní 114"
                />
                {form.formState.errors.street && (
                  <p className="mt-1 text-xs text-destructive" role="alert">
                    {form.formState.errors.street.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="city">Město</Label>
                <Input
                  id="city"
                  {...form.register("city")}
                  className="mt-1"
                  placeholder="Cvikov"
                />
                {form.formState.errors.city && (
                  <p className="mt-1 text-xs text-destructive" role="alert">
                    {form.formState.errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="postalCode">PSČ</Label>
                <Input
                  id="postalCode"
                  {...form.register("postalCode")}
                  className="mt-1"
                  placeholder="47154"
                />
                {form.formState.errors.postalCode && (
                  <p className="mt-1 text-xs text-destructive" role="alert">
                    {form.formState.errors.postalCode.message}
                  </p>
                )}
              </div>
            </fieldset>

            <fieldset className="space-y-4 rounded-lg border border-border/60 bg-warm-50/30 p-4">
              <legend className="px-1 font-serif text-lg">Váš kontakt</legend>
              <p className="text-sm text-muted-foreground">
                Pro potvrzení objednávky — není součástí adresy na pohledu
              </p>

              <div>
                <Label htmlFor="customerEmail">Váš e-mail</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  {...form.register("customerEmail")}
                  className="mt-1"
                />
                {form.formState.errors.customerEmail && (
                  <p className="mt-1 text-xs text-destructive" role="alert">
                    {form.formState.errors.customerEmail.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Telefon (volitelné)</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...form.register("phone")}
                  className="mt-1"
                />
              </div>
            </fieldset>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading
                ? "Přesměrování na platbu…"
                : `Zaplatit ${formatPrice(total)}`}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
