import Link from "next/link";
import { prisma } from "@/lib/db";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { ProductsTable } from "@/components/admin/ProductsTable";

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
        title={`Продукты (${products.length})`}
        actions={
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            + Добавить
          </Link>
        }
      />

      <div className="p-6">
        {/* Filters */}
        <form className="flex gap-3 mb-5">
          <input
            name="search"
            defaultValue={search}
            placeholder="Поиск по названию или ID..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 w-64"
          />
          <select
            name="category"
            defaultValue={category}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
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
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Найти
          </button>
          {(search || category) && (
            <Link
              href="/admin/products"
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
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
