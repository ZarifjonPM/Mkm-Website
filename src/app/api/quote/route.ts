import { NextRequest, NextResponse } from "next/server";
import { quoteFormSchema } from "@/lib/validation";
import { sendTelegram } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = quoteFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, company, phone, email, message, category, productName } =
      parsed.data;

    const text =
      `📋 <b>Запрос КП: ${productName || category || "Общий запрос"}</b>\n\n` +
      `<b>Имя:</b> ${name}\n` +
      `<b>Компания:</b> ${company || "—"}\n` +
      `<b>Телефон:</b> ${phone}\n` +
      `<b>Email:</b> ${email}\n` +
      `<b>Категория:</b> ${category || "—"}\n` +
      `<b>Продукт:</b> ${productName || "—"}\n` +
      `<b>Сообщение:</b> ${message}`;

    await sendTelegram(text);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quote API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
