import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { siteSettingsSchema } from "@/lib/validation";

function revalidateAll() {
  revalidatePath("/ru/contacts");
  revalidatePath("/uz/contacts");
  revalidatePath("/ru", "layout");
  revalidatePath("/uz", "layout");
}

const SINGLETON_ID = "singleton";

export async function GET(request: NextRequest) {
  const denied = await requireAuth(request);
  if (denied) return denied;

  let settings = await prisma.siteSettings.findUnique({ where: { id: SINGLETON_ID } });
  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        id: SINGLETON_ID,
        phone1: "",
        phone2: "",
        email: "",
        addressRu: "",
        addressUz: "",
        mapEmbedUrl: "",
      },
    });
  }
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const denied = await requireAuth(request);
  if (denied) return denied;

  const body = await request.json();
  const parsed = siteSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.siteSettings.findUnique({ where: { id: SINGLETON_ID } });
  let settings;
  if (!existing) {
    settings = await prisma.siteSettings.create({
      data: { id: SINGLETON_ID, ...parsed.data },
    });
  } else {
    settings = await prisma.siteSettings.update({
      where: { id: SINGLETON_ID },
      data: parsed.data,
    });
  }

  revalidateAll();
  return NextResponse.json(settings);
}
