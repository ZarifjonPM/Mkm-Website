import Link from "next/link";
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
      <AdminTopbar
        title="Новый продукт"
        actions={
          <Link href="/admin/products" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад
          </Link>
        }
      />
      <div className="p-8 max-w-4xl">
        <ProductForm categories={categories} mode="create" />
      </div>
    </>
  );
}
