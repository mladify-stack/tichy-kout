import { redirect } from "next/navigation";

/** Platba probíhá přes košík → Stripe Checkout */
export default function PaymentPage() {
  redirect("/kosik");
}
