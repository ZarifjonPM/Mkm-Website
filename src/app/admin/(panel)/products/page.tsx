import Link from "next/link";
import { prisma } from "@/lib/db";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { ProductsTable } from "@/components/admin/ProductsTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string };
}) {
  const search = searchParams.search ?? "";
  const category = searchParams.category ?? "";

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
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
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <>
      <AdminTopbar
        title="Продукты"
        actions={
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-blue-600/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Добавить
          </Link>
        }
      />

      <div className="p-8">
        {/* Stats */}
        <div className="mb-6 flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-800">{products.length}</span>
          <span className="text-slate-500 text-sm">
            {search || category ? "найдено" : "продуктов в каталоге"}
          </span>
        </div>

        {/* Filters */}
        <form className="flex flex-wrap gap-2.5 mb-6 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="relative flex-1 min-w-48">
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              name="search"
              defaultValue={search}
              placeholder="Поиск по названию или ID..."
              className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
            />
          </div>
          <select
            name="category"
            defaultValue={category}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 text-slate-700"
          >
            <option value="">Все категории</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nameRu}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            Найти
          </button>
          {(search || category) && (
            <Link
              href="/admin/products"
              className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Сбросить
            </Link>
          )}
        </form>

        <ProductsTable products={products} />
      </div>
    </>
  );
}
