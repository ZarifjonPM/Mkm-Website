import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
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

function revalidateCatalog() {
  revalidatePath("/ru/catalog");
  revalidatePath("/uz/catalog");
  revalidatePath("/ru");
  revalidatePath("/uz");
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireAuth(request);
  if (denied) return denied;

  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(product);
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

  const product = await prisma.product.update({
    where: { id: params.id },
    data: parsed.data,
  });

  revalidateCatalog();
  return NextResponse.json(product);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireAuth(request);
  if (denied) return denied;

  await prisma.product.delete({ where: { id: params.id } });
  revalidateCatalog();
  return NextResponse.json({ success: true });
}
