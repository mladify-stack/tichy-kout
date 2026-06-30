"use client";

import { useState } from "react";
import { PostcardDoublePreview } from "@/components/postcard/postcard-double-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Copy } from "lucide-react";

interface OrderRecapProps {
  imageUrl: string;
  postcardName: string;
  message: string;
  signature: string | null;
  fontFamily: string;
  textAlignment: string;
  recipientName: string;
  street: string;
  city: string;
  postalCode: string;
  customerEmail: string | null;
  phone: string | null | undefined;
}

function formatPostalCode(code: string) {
  const digits = code.replace(/\s/g, "");
  if (digits.length === 5) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return code;
}

export function OrderRecap({
  imageUrl,
  postcardName,
  message,
  signature,
  fontFamily,
  textAlignment,
  recipientName,
  street,
  city,
  postalCode,
  customerEmail,
  phone,
}: OrderRecapProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const addressBlock = [
    recipientName,
    street,
    `${formatPostalCode(postalCode)} ${city}`,
  ]
    .filter(Boolean)
    .join("\n");

  const messageBlock = signature
    ? `${message}\n\n— ${signature}`
    : message;

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 font-serif text-xl">Náhled pohledu</h2>
        <p className="mb-4 text-sm text-muted-foreground">{postcardName}</p>
        <PostcardDoublePreview
          imageUrl={imageUrl}
          message={message}
          signature={signature}
          fontFamily={fontFamily}
          textAlignment={textAlignment}
          size="lg"
        />
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Vzkaz (rub)</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copy(messageBlock, "message")}
            >
              {copied === "message" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="ml-2">Kopírovat</span>
            </Button>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{messageBlock}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Adresa doručení</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copy(addressBlock, "address")}
            >
              {copied === "address" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="ml-2">Kopírovat</span>
            </Button>
          </CardHeader>
          <CardContent>
            <address className="not-italic text-sm leading-relaxed">
              {recipientName}
              <br />
              {street}
              <br />
              {formatPostalCode(postalCode)} {city}
            </address>
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Kontakt zákazníka</CardTitle>
          <p className="text-sm text-muted-foreground">
            Odděleně od adresy — pro vaši evidenci, ne pro pohled
          </p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">E-mail: </span>
            {customerEmail ?? "—"}
          </p>
          <p>
            <span className="text-muted-foreground">Telefon: </span>
            {phone ?? "—"}
          </p>
        </CardContent>
      </Card>

      <section className="rounded-lg bg-warm-50/50 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Pro ruční zadání do České pošty</p>
        <ol className="mt-2 list-inside list-decimal space-y-1">
          <li>Stáhněte nebo zkopírujte obrázek z líc pohledu</li>
          <li>Vložte vzkaz z rubu</li>
          <li>Zadejte adresu doručení (bez e-mailu a telefonu)</li>
        </ol>
      </section>
    </div>
  );
}
