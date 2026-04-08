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
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, { method: "DELETE" });
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
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-600">Продукты не найдены</p>
        <p className="text-xs text-slate-400 mt-1">Попробуйте изменить фильтры</p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-3 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-700">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">ID</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Название</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Категория</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Тип</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Стандарты</th>
              <th className="px-5 py-3.5 w-40" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/70 transition-colors group">
                <td className="px-5 py-3.5 text-slate-400 font-mono text-xs max-w-[140px] truncate">
                  {product.id}
                </td>
                <td className="px-5 py-3.5 font-medium text-slate-900">
                  {product.nameRu}
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                    {product.category.nameRu}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-500 text-xs">{product.typeRu}</td>
                <td className="px-5 py-3.5 text-slate-400 text-xs">
                  {product.standards.slice(0, 2).join(", ")}
                  {product.standards.length > 2 && (
                    <span className="text-slate-300"> +{product.standards.length - 2}</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium border border-slate-200 rounded-md text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Изменить
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(product)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium border border-red-200 rounded-md text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
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
        description="Это действие необратимо. Продукт будет удалён из базы данных."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
