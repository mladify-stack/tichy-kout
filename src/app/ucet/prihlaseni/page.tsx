"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const form = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const [error, setError] = useState<string | null>(null);

  if (status === "authenticated") {
    router.push("/ucet");
    return null;
  }

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (result?.error) {
      setError("Neplatný e-mail nebo heslo");
    } else {
      router.push("/ucet");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Přihlášení</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" {...form.register("email")} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Heslo</Label>
              <Input id="password" type="password" {...form.register("password")} className="mt-1" />
            </div>
            {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
            <Button type="submit" className="w-full">Přihlásit se</Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link href="/ucet" className="hover:underline">Zpět na účet</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
