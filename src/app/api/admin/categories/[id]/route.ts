import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

function revalidateCatalog() {
  revalidatePath("/ru/catalog");
  revalidatePath("/uz/catalog");
  revalidatePath("/ru");
  revalidatePath("/uz");
  revalidatePath("/admin/categories");
}

const updateSchema = z.object({
  nameRu: z.string().min(2).max(200),
  nameUz: z.string().min(2).max(200),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).optional(),
  descRu: z.string().min(2),
  descUz: z.string().min(2),
  icon: z.string().optional(),
  image: z.string().optional(),
  order: z.number().int().min(1).optional(),
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

  // Only update defined fields
  const data: Record<string, unknown> = {
    nameRu: parsed.data.nameRu,
    nameUz: parsed.data.nameUz,
    descRu: parsed.data.descRu,
    descUz: parsed.data.descUz,
  };
  if (parsed.data.slug !== undefined) data.slug = parsed.data.slug;
  if (parsed.data.icon !== undefined) data.icon = parsed.data.icon;
  if (parsed.data.image !== undefined) data.image = parsed.data.image;
  if (parsed.data.order !== undefined) data.order = parsed.data.order;

  const category = await prisma.category.update({
    where: { id: params.id },
    data,
  });

  revalidateCatalog();
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
      { error: `Нельзя удалить: в категории ${category._count.products} продуктов` },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id: params.id } });
  revalidateCatalog();
  return NextResponse.json({ success: true });
}
