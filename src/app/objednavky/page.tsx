import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatPrice, ORDER_STATUS_LABELS } from "@/lib/utils";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Moje objednávky",
  path: "/objednavky",
  noIndex: true,
});

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/ucet/prihlaseni");

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
      status: { not: "DRAFT" },
    },
    include: {
      items: { include: { postcard: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl">Moje objednávky</h1>

      {orders.length === 0 ? (
        <p className="mt-6 text-muted-foreground">
          Zatím nemáte žádné objednávky.{" "}
          <Link href="/pohledy" className="text-primary hover:underline">
            Napsat první pohled
          </Link>
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="rounded-lg border border-border/60 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.items[0]?.postcard.name} ·{" "}
                    {ORDER_STATUS_LABELS[order.status]}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  {formatPrice(order.totalCents)}
                </p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString("cs-CZ")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
