import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ORDER_STATUS_LABELS } from "@/lib/utils";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !isAdmin(session.user.email, session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { status: { not: "DRAFT" } },
    include: {
      items: { include: { postcard: true } },
      shippingAddress: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "Číslo objednávky",
    "Stav",
    "Příjemce",
    "E-mail",
    "Ulice",
    "Město",
    "PSČ",
    "Pohled",
    "Vzkaz",
    "Celkem Kč",
    "Vytvořeno",
  ];

  const rows = orders.map((o) => [
    o.orderNumber,
    ORDER_STATUS_LABELS[o.status] ?? o.status,
    o.recipientName ?? "",
    o.recipientEmail ?? "",
    o.shippingAddress?.street ?? "",
    o.shippingAddress?.city ?? "",
    o.shippingAddress?.postalCode ?? "",
    o.items[0]?.postcard.name ?? "",
    o.items[0]?.message ?? "",
    (o.totalCents / 100).toFixed(0),
    o.createdAt.toISOString(),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="objednavky-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
