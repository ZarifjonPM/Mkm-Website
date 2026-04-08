import Link from "next/link";
import { prisma } from "@/lib/db";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { CategoriesTable } from "@/components/admin/CategoriesTable";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <>
      <AdminTopbar
        title={`Категории (${categories.length})`}
        actions={
          <Link
            href="/admin/categories/new"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            + Добавить
          </Link>
        }
      />
      <div className="p-6">
        <CategoriesTable categories={categories} />
      </div>
    </>
  );
}
