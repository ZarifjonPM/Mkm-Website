import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({
      orderBy: { order: "asc" },
      select: { id: true, nameRu: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <>
      <AdminTopbar title={`Редактировать: ${product.nameRu}`} />
      <div className="p-6">
        <ProductForm
          initialData={product}
          categories={categories}
          mode="edit"
        />
      </div>
    </>
  );
}
