import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const category = await prisma.category.findUnique({
    where: { id: params.id },
    include: { _count: { select: { products: true } } },
  });

  if (!category) notFound();

  return (
    <>
      <AdminTopbar
        title={`Редактировать: ${category.nameRu}`}
        actions={
          <span className="text-sm text-gray-400">
            {category._count.products} продуктов
          </span>
        }
      />
      <div className="p-6">
        <CategoryForm initialData={category} mode="edit" />
      </div>
    </>
  );
}
