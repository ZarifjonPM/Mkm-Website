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
      const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, { method: "DELETE" });
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
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide w-12">#</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Название</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">ID / Slug</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Продуктов</th>
              <th className="px-5 py-3.5 w-40" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors group">
                <td className="px-5 py-4 text-slate-400 font-medium text-sm">{cat.order}</td>
                <td className="px-5 py-4 font-semibold text-slate-900">{cat.nameRu}</td>
                <td className="px-5 py-4 text-slate-400 font-mono text-xs">{cat.id}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                    cat._count.products > 0
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-400"
                  }`}>
                    {cat._count.products} шт.
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/admin/categories/${cat.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium border border-slate-200 rounded-md text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Изменить
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      disabled={cat._count.products > 0}
                      title={cat._count.products > 0 ? "Нельзя удалить: есть продукты" : undefined}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium border border-red-200 rounded-md text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
        title={`Удалить категорию "${deleteTarget?.nameRu}"?`}
        description="Убедитесь, что в категории нет продуктов."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
