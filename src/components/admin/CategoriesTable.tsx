"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

interface Category {
  id: string;
  nameRu: string;
  slug: string;
  order: number;
  _count: { products: number };
}

export function CategoriesTable({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteTarget(null);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Ошибка удаления");
        setDeleteTarget(null);
      }
    } catch {
      setError("Ошибка сети");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-12">#</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Название</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">ID / Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Продукты</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400">{cat.order}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{cat.nameRu}</td>
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{cat.id}</td>
                <td className="px-4 py-3 text-gray-500">{cat._count.products}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <Link
                      href={`/admin/categories/${cat.id}`}
                      className="px-3 py-1 text-xs border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Изменить
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      disabled={cat._count.products > 0}
                      title={
                        cat._count.products > 0
                          ? "Нельзя удалить: есть продукты"
                          : undefined
                      }
                      className="px-3 py-1 text-xs border border-red-200 rounded-md text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title={`Удалить категорию "${deleteTarget?.nameRu}"?`}
        description="Убедитесь, что в категории нет продуктов."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
