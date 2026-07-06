import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions, isAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ORDER_STATUS_LABELS, formatPrice } from "@/lib/utils";
import { OrderRecap } from "@/components/admin/order-recap";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user || !isAdmin(session.user.email, session.user.role)) {
    redirect("/ucet/prihlaseni");
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { postcard: true } },
      shippingAddress: true,
      payment: true,
    },
  });

  if (!order || order.status === "DRAFT") {
    notFound();
  }

  const item = order.items[0];
  if (!item) notFound();

  const previewData = item.previewData as { textColor?: string } | null;
  const textColor = previewData?.textColor ?? "BLUE";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            <Link href="/admin" className="hover:underline">
              ← Administrace
            </Link>
          </p>
          <h1 className="mt-2 font-serif text-3xl">Rekapitulace objednávky</h1>
          <p className="mt-1 font-mono text-sm text-muted-foreground">
            {order.orderNumber}
          </p>
        </div>
        <div className="text-right text-sm">
          <p>
            <span className="text-muted-foreground">Stav: </span>
            {ORDER_STATUS_LABELS[order.status] ?? order.status}
          </p>
          <p className="mt-1">
            <span className="text-muted-foreground">Cena: </span>
            {formatPrice(order.totalCents)}
          </p>
          <p className="mt-1 text-muted-foreground">
            {new Date(order.createdAt).toLocaleString("cs-CZ")}
          </p>
        </div>
      </div>

      <OrderRecap
        imageUrl={item.postcard.imageUrl}
        postcardName={item.postcard.name}
        message={item.message}
        signature={item.signature}
        textColor={textColor}
        salutation={order.shippingAddress?.salutation}
        recipientName={order.recipientName ?? order.shippingAddress?.name ?? ""}
        street={order.shippingAddress?.street ?? ""}
        city={order.shippingAddress?.city ?? ""}
        postalCode={order.shippingAddress?.postalCode ?? ""}
        customerEmail={order.recipientEmail}
        phone={order.shippingAddress?.phone}
      />
    </div>
  );
}
