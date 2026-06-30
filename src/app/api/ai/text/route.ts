import { NextRequest, NextResponse } from "next/server";
import { generateAiText } from "@/lib/ai-text";
import { aiTextSchema } from "@/lib/validations";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import type { AiTextCategory } from "@prisma/client";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = rateLimit(`ai:${ip}`, 15);
  if (!limit.success) {
    return NextResponse.json({ error: "Příliš mnoho požadavků" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = aiTextSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Neplatná kategorie" }, { status: 400 });
    }

    const text = await generateAiText(
      parsed.data.category as AiTextCategory,
      parsed.data.context
    );

    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "Chyba generování textu" }, { status: 500 });
  }
}
