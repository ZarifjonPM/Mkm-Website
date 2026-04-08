import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const categorySchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  nameRu: z.string().min(2).max(200),
  nameUz: z.string().min(2).max(200),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  descRu: z.string().min(2),
  descUz: z.string().min(2),
  icon: z.string().optional(),
  image: z.string().optional(),
  order: z.number().int().min(1).optional(),
});

export async function GET(request: NextRequest) {
  const denied = await requireAuth(request);
  if (denied) return denied;

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const denied = await requireAuth(request);
  if (denied) return denied;

  const body = await request.json();
  const parsed = categorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.category.findUnique({ where: { id: parsed.data.id } });
  if (existing) {
    return NextResponse.json({ error: "Категория с таким ID уже существует" }, { status: 409 });
  }

  const maxOrder = await prisma.category.aggregate({ _max: { order: true } });
  const nextOrder = (maxOrder._max.order ?? 0) + 1;

  const category = await prisma.category.create({
    data: {
      ...parsed.data,
      icon: parsed.data.icon || `/icons/${parsed.data.id}.svg`,
      image: parsed.data.image || `/images/catalog/${parsed.data.id}.jpg`,
      order: parsed.data.order ?? nextOrder,
    },
  });
  return NextResponse.json(category, { status: 201 });
}
