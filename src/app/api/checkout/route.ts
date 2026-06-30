import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizeText, generateOrderNumber, POSTCARD_PRICE_CENTS, SHIPPING_PRICE_CENTS } from "@/lib/utils";
import { shippingSchema } from "@/lib/validations";
import { z } from "zod";

const checkoutSchema = z.object({
  shipping: shippingSchema,
  draft: z.object({
    postcardId: z.string(),
    message: z.string().min(10).max(500),
    signature: z.string().max(100).optional(),
    fontFamily: z.enum(["SERIF", "SANS", "HANDWRITING", "ELEGANT"]),
    textAlignment: z.enum(["LEFT", "CENTER", "RIGHT"]),
    priceCents: z.number().optional(),
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

    const subtotal = draft.priceCents ?? postcard.priceCents ?? POSTCARD_PRICE_CENTS;
    const shippingCents = SHIPPING_PRICE_CENTS;
    const total = subtotal + shippingCents;

    const address = await prisma.address.create({
      data: {
        userId: session?.user?.id,
        name: shipping.recipientName,
        street: sanitizeText(shipping.street),
        city: sanitizeText(shipping.city),
        postalCode: shipping.postalCode.replace(/\s/g, ""),
        country: shipping.country,
        phone: shipping.phone,
      },
    });

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session?.user?.id,
        status: "DRAFT",
        recipientName: sanitizeText(shipping.recipientName),
        recipientEmail: shipping.recipientEmail.toLowerCase(),
        shippingAddressId: address.id,
        subtotalCents: subtotal,
        shippingCents,
        totalCents: total,
        items: {
          create: {
            postcardId: postcard.id,
            message: sanitizeText(draft.message),
            signature: draft.signature ? sanitizeText(draft.signature) : null,
            fontFamily: draft.fontFamily,
            textAlignment: draft.textAlignment,
            charCount: draft.message.length,
            priceCents: subtotal,
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
      customer_email: shipping.recipientEmail,
      line_items: [
        {
          price_data: {
            currency: "czk",
            product_data: {
              name: `Pohled — ${postcard.name}`,
              description: "Tištěný pohled s vaším vzkazem, odeslaný poštou",
            },
            unit_amount: subtotal,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "czk",
            product_data: { name: "Poštovné" },
            unit_amount: shippingCents,
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
