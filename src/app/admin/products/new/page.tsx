import { prisma } from "@/lib/db";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { id: true, nameRu: true },
  });

  return (
    <>
      <AdminTopbar title="Новый продукт" />
      <div className="p-6">
        <ProductForm categories={categories} mode="create" />
      </div>
    </>
  );
}
