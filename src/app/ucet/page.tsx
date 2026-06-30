"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isAdminRole } from "@/lib/permissions";

export default function AccountPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (!session) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-serif text-3xl">Můj účet</h1>
        <p className="mt-3 text-muted-foreground">
          Přihlaste se pro zobrazení objednávek.
        </p>
        <Button asChild className="mt-6">
          <Link href="/ucet/prihlaseni">Přihlásit se</Link>
        </Button>
      </div>
    );
  }

  const admin = isAdminRole(session.user.role);

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="font-serif text-3xl">Můj účet</h1>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{session.user.name ?? session.user.email}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/objednavky">Moje objednávky</Link>
          </Button>
          {admin && (
            <Button asChild variant="secondary" className="w-full">
              <Link href="/admin">Administrace</Link>
            </Button>
          )}
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Odhlásit se
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
