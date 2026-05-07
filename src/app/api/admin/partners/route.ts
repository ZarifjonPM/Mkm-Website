import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { partnerFormSchema } from "@/lib/validation";

function revalidatePartners() {
  revalidatePath("/ru/partners");
  revalidatePath("/uz/partners");
  revalidatePath("/ru");
  revalidatePath("/uz");
}

export async function GET(request: NextRequest) {
  const denied = await requireAuth(request);
  if (denied) return denied;

  const partners = await prisma.partner.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(partners);
}

export async function POST(request: NextRequest) {
  const denied = await requireAuth(request);
  if (denied) return denied;

  const body = await request.json();
  const parsed = partnerFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const partner = await prisma.partner.create({
    data: { ...parsed.data, url: parsed.data.url || null },
  });
  revalidatePartners();
  return NextResponse.json(partner, { status: 201 });
}
