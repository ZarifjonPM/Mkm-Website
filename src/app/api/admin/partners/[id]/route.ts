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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireAuth(request);
  if (denied) return denied;

  const partner = await prisma.partner.findUnique({ where: { id: params.id } });
  if (!partner) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(partner);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

  const partner = await prisma.partner.update({
    where: { id: params.id },
    data: { ...parsed.data, url: parsed.data.url || null },
  });
  revalidatePartners();
  return NextResponse.json(partner);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireAuth(request);
  if (denied) return denied;

  await prisma.partner.delete({ where: { id: params.id } });
  revalidatePartners();
  return NextResponse.json({ success: true });
}
