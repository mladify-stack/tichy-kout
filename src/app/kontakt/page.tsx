"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactFormData } from "@/lib/validations";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setError(null);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setSent(true);
    } else {
      setError("Zprávu se nepodařilo odeslat. Zkuste to prosím znovu.");
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl">Kontakt</h1>
      <p className="mt-3 text-muted-foreground">
        Máte otázku? Napište nám — odpovíme co nejdříve.
      </p>

      {sent ? (
        <p className="mt-8 text-sage-600" role="status">
          Děkujeme za zprávu. Ozveme se vám.
        </p>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div>
            <Label htmlFor="name">Jméno</Label>
            <Input id="name" {...form.register("name")} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" {...form.register("email")} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="message">Zpráva</Label>
            <Textarea id="message" {...form.register("message")} className="mt-1 min-h-[120px]" />
          </div>
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <Button type="submit">Odeslat</Button>
        </form>
      )}

      <p className="mt-10 text-sm text-muted-foreground">
        E-mail: info@tichy-kout.cz
      </p>
    </div>
  );
}
