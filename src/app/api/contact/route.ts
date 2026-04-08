import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation";
import { sendTelegram } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, company, phone, email, message } = parsed.data;

    let text = `📩 <b>Новое сообщение с сайта</b>\n\n`;
    text += `<b>Имя:</b> ${name}\n`;
    if (company) text += `<b>Компания:</b> ${company}\n`;
    text += `<b>Телефон:</b> ${phone}\n`;
    if (email) text += `<b>Email:</b> ${email}\n`;
    text += `<b>Сообщение:</b>\n${message}`;

    await sendTelegram(text);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
