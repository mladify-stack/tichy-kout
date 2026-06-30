import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "NEW",
          paidAt: new Date(),
          stripeSessionId: session.id,
        },
        include: { payment: true },
      });

      if (order.payment) {
        await prisma.payment.update({
          where: { id: order.payment.id },
          data: {
            status: "COMPLETED",
            stripePaymentId: session.payment_intent as string,
            stripeSessionId: session.id,
          },
        });
      }

      if (order.recipientEmail) {
        await sendOrderConfirmationEmail({
          to: order.recipientEmail,
          orderNumber: order.orderNumber,
          totalCents: order.totalCents,
          recipientName: order.recipientName ?? "příjemce",
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
