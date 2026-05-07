"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

interface Service {
  id: string;
  slug: string;
  icon: string;
  titleRu: string;
  titleUz: string;
  order: number;
  isActive: boolean;
}

export function ServicesTable({ services }: { services: Service[] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/services/${deleteTarget.id}`, { method: "DELETE" });
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
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Заголовок</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Slug</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Статус</th>
              <th className="px-5 py-3.5 w-40" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {services.map((svc) => (
              <tr key={svc.id} className="hover:bg-slate-50/70 transition-colors group">
                <td className="px-5 py-4 text-slate-400 font-medium text-sm">{svc.order}</td>
                <td className="px-5 py-4 font-semibold text-slate-900">{svc.titleRu}</td>
                <td className="px-5 py-4 text-slate-400 font-mono text-xs">{svc.slug}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                    svc.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-400"
                  }`}>
                    {svc.isActive ? "Активен" : "Скрыт"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-1.5 justify-end">
                    <Link
                      href={`/admin/services/${svc.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium border border-slate-200 rounded-md text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Изменить
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(svc)}
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
            {services.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-slate-400 text-sm">
                  Услуг пока нет. Нажмите «Добавить», чтобы создать первую.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title={`Удалить услугу "${deleteTarget?.titleRu}"?`}
        description="Действие нельзя отменить."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
