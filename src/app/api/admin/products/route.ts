import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const productSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Must be kebab-case"),
  nameRu: z.string().min(2).max(200),
  nameUz: z.string().min(2).max(200),
  descRu: z.string().min(2),
  descUz: z.string().min(2),
  categoryId: z.string().min(1),
  typeRu: z.string().min(1).max(100),
  typeUz: z.string().min(1).max(100),
  materials: z
    .array(
      z.enum([
        "carbon-steel",
        "stainless-steel",
        "alloy-steel",
        "cast-iron",
        "non-ferrous",
      ])
    )
    .min(1),
  purposes: z
    .array(
      z.enum(["oil-gas", "construction", "mechanical", "electrical", "industrial"])
    )
    .min(1),
  standards: z.array(z.string().min(1)),
  image: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const denied = await requireAuth(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";

  const products = await prisma.product.findMany({
    where: {
      ...(category ? { categoryId: category } : {}),
      ...(search
        ? {
            OR: [
              { nameRu: { contains: search, mode: "insensitive" } },
              { nameUz: { contains: search, mode: "insensitive" } },
              { id: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ categoryId: "asc" }, { id: "asc" }],
    include: { category: { select: { nameRu: true } } },
  });

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const denied = await requireAuth(request);
  if (denied) return denied;

  const body = await request.json();
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.product.findUnique({ where: { id: parsed.data.id } });
  if (existing) {
    return NextResponse.json({ error: "Product with this ID already exists" }, { status: 409 });
  }

  const product = await prisma.product.create({
    data: { ...parsed.data, image: parsed.data.image ?? "" },
  });

  revalidatePath("/ru/catalog");
  revalidatePath("/uz/catalog");
  revalidatePath("/ru");
  revalidatePath("/uz");

  return NextResponse.json(product, { status: 201 });
}
