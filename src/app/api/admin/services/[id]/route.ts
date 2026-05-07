import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { serviceFormSchema } from "@/lib/validation";

function revalidateServices() {
  revalidatePath("/ru/services");
  revalidatePath("/uz/services");
  revalidatePath("/ru");
  revalidatePath("/uz");
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireAuth(request);
  if (denied) return denied;

  const service = await prisma.service.findUnique({ where: { id: params.id } });
  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(service);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireAuth(request);
  if (denied) return denied;

  const body = await request.json();
  const parsed = serviceFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const slugConflict = await prisma.service.findFirst({
    where: { slug: parsed.data.slug, NOT: { id: params.id } },
  });
  if (slugConflict) {
    return NextResponse.json({ error: "Slug already taken" }, { status: 409 });
  }

  const service = await prisma.service.update({
    where: { id: params.id },
    data: parsed.data,
  });
  revalidateServices();
  return NextResponse.json(service);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireAuth(request);
  if (denied) return denied;

  await prisma.service.delete({ where: { id: params.id } });
  revalidateServices();
  return NextResponse.json({ success: true });
}
