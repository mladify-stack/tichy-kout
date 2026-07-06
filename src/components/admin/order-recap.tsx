"use client";

import { useState } from "react";
import { PostcardDoublePreview } from "@/components/postcard/postcard-double-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Copy } from "lucide-react";
import type { TextColor } from "@/lib/utils";
import { BRAND_FOOTER_NOTE } from "@/lib/postcard-constants";

interface OrderRecapProps {
  imageUrl: string;
  postcardName: string;
  message: string;
  signature: string | null;
  textColor: TextColor | string;
  salutation?: string | null;
  recipientName: string;
  street: string;
  city: string;
  postalCode: string;
  customerEmail: string | null;
  phone: string | null | undefined;
}

function formatPostalLine(code: string) {
  return code.replace(/\s/g, "");
}

export function OrderRecap({
  imageUrl,
  postcardName,
  message,
  signature,
  textColor,
  salutation,
  recipientName,
  street,
  city,
  postalCode,
  customerEmail,
  phone,
}: OrderRecapProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const addressLines = [
    salutation,
    recipientName,
    street,
    formatPostalLine(postalCode),
    city,
  ].filter(Boolean);

  const addressBlock = addressLines.join("\n");

  const messageBlock = [
    message,
    signature ? `— ${signature}` : null,
    BRAND_FOOTER_NOTE,
  ]
    .filter(Boolean)
    .join("\n\n");

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
          textColor={textColor}
          size="lg"
          address={{
            salutation: salutation ?? undefined,
            name: recipientName,
            street,
            city,
            postalCode,
          }}
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
            <p className="whitespace-pre-wrap text-sm leading-relaxed font-handwriting">
              {messageBlock}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Adresa na pohledu</CardTitle>
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
              {addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
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
          <li>Vložte vzkaz z rubu (včetně poznámky o tichy-kout.cz)</li>
          <li>Zadejte adresu ve stejném pořadí: oslovení, jméno, ulice, PSČ, město</li>
        </ol>
      </section>
    </div>
  );
}
