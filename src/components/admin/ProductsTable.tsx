"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

interface Product {
  id: string;
  nameRu: string;
  categoryId: string;
  typeRu: string;
  materials: string[];
  purposes: string[];
  standards: string[];
  category: { nameRu: string };
}

export function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteTarget(null);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Ошибка удаления");
      }
    } catch {
      setError("Ошибка сети");
    } finally {
      setDeleting(false);
    }
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        Продукты не найдены
      </div>
    );
  }

  return (
    <>
      {error && (
        <p className="mb-3 text-sm text-red-600">{error}</p>
      )}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Название</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Категория</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Тип</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Стандарты</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400 font-mono text-xs max-w-[140px] truncate">
                  {product.id}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {product.nameRu}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {product.category.nameRu}
                </td>
                <td className="px-4 py-3 text-gray-500">{product.typeRu}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {product.standards.slice(0, 2).join(", ")}
                  {product.standards.length > 2 && ` +${product.standards.length - 2}`}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="px-3 py-1 text-xs border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Изменить
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(product)}
                      className="px-3 py-1 text-xs border border-red-200 rounded-md text-red-600 hover:bg-red-50 transition-colors"
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
        title={`Удалить "${deleteTarget?.nameRu}"?`}
        description="Это действие необратимо."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
