import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizeText, generateOrderNumber, POSTCARD_PRICE_CENTS, MAX_MESSAGE_LENGTH } from "@/lib/utils";
import { shippingSchema } from "@/lib/validations";
import { z } from "zod";

const checkoutSchema = z.object({
  shipping: shippingSchema,
  draft: z.object({
    postcardId: z.string(),
    message: z.string().min(10).max(MAX_MESSAGE_LENGTH),
    signature: z.string().max(100).optional(),
    textColor: z.enum(["BLUE", "BLACK", "RED", "GREEN"]).default("BLUE"),
    priceCents: z.number().optional(),
    isCustomPhoto: z.boolean().optional(),
    customImageData: z.string().optional(),
    imageUrl: z.string().optional(),
  }),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = rateLimit(`checkout:${ip}`, 10);
  if (!limit.success) {
    return NextResponse.json({ error: "Příliš mnoho požadavků" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Neplatná data" }, { status: 400 });
    }

    const { shipping, draft } = parsed.data;
    const session = await getServerSession(authOptions);

    const postcard = await prisma.postcard.findUnique({
      where: { id: draft.postcardId, isActive: true },
    });
    if (!postcard) {
      return NextResponse.json({ error: "Pohled nenalezen" }, { status: 404 });
    }

    const total = POSTCARD_PRICE_CENTS;

    const address = await prisma.address.create({
      data: {
        userId: session?.user?.id,
        salutation: shipping.salutation
          ? sanitizeText(shipping.salutation)
          : null,
        name: shipping.recipientName,
        street: sanitizeText(shipping.street),
        city: sanitizeText(shipping.city),
        postalCode: shipping.postalCode.replace(/\s/g, ""),
        country: shipping.country,
        phone: shipping.phone || null,
      },
    });

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session?.user?.id,
        status: "DRAFT",
        recipientName: sanitizeText(shipping.recipientName),
        recipientEmail: shipping.customerEmail.toLowerCase(),
        shippingAddressId: address.id,
        subtotalCents: total,
        shippingCents: 0,
        totalCents: total,
        items: {
          create: {
            postcardId: postcard.id,
            message: sanitizeText(draft.message),
            signature: draft.signature ? sanitizeText(draft.signature) : null,
            fontFamily: "HANDWRITING",
            textAlignment: "LEFT",
            charCount: draft.message.length,
            priceCents: total,
            previewData: {
              textColor: draft.textColor ?? "BLUE",
              isCustomPhoto: draft.isCustomPhoto ?? false,
              customImageData: draft.customImageData ?? null,
              imageUrl: draft.isCustomPhoto
                ? draft.customImageData ?? draft.imageUrl
                : postcard.imageUrl,
            },
          },
        },
        payment: {
          create: {
            amountCents: total,
            status: "PENDING",
          },
        },
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    if (!stripe) {
      return NextResponse.json({ error: "Platby nejsou nakonfigurovány" }, { status: 503 });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: shipping.customerEmail,
      line_items: [
        {
          price_data: {
            currency: "czk",
            product_data: {
              name: `Pohled — ${postcard.name}`,
              description: "Tištěný pohled s vaším vzkazem včetně poštovného",
            },
            unit_amount: total,
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
      success_url: `${appUrl}/platba/dekujeme?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/kosik`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: stripeSession.id },
    });

    await prisma.payment.update({
      where: { orderId: order.id },
      data: { stripeSessionId: stripeSession.id },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Chyba při vytváření platby" }, { status: 500 });
  }
}
