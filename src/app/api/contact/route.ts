import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { sendContactEmail } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = rateLimit(`contact:${ip}`, 5);
  if (!limit.success) {
    return NextResponse.json({ error: "Příliš mnoho zpráv" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Neplatná data" }, { status: 400 });
    }

    const { name, email, message } = parsed.data;
    await sendContactEmail({
      name: sanitizeText(name),
      email,
      message: sanitizeText(message),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Chyba odeslání" }, { status: 500 });
  }
}
