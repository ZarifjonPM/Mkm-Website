import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  nameRu: z.string().min(2).max(200),
  nameUz: z.string().min(2).max(200),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  descRu: z.string().min(2),
  descUz: z.string().min(2),
  icon: z.string().startsWith("/"),
  image: z.string().startsWith("/"),
  order: z.number().int().min(1),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireAuth(request);
  if (denied) return denied;

  const category = await prisma.category.findUnique({
    where: { id: params.id },
    include: { _count: { select: { products: true } } },
  });

  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(category);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireAuth(request);
  if (denied) return denied;

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const category = await prisma.category.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return NextResponse.json(category);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireAuth(request);
  if (denied) return denied;

  const category = await prisma.category.findUnique({
    where: { id: params.id },
    include: { _count: { select: { products: true } } },
  });

  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (category._count.products > 0) {
    return NextResponse.json(
      { error: `Cannot delete: category has ${category._count.products} product(s)` },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
