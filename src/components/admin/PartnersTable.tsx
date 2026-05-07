"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

interface Partner {
  id: string;
  name: string;
  logo: string;
  url: string | null;
  order: number;
  isActive: boolean;
}

export function PartnersTable({ partners }: { partners: Partner[] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Partner | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [replacingId, setReplacingId] = useState<string | null>(null);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/partners/${deleteTarget.id}`, { method: "DELETE" });
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

  async function handleReplace(partner: Partner, file: File) {
    setReplacingId(partner.id);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const upload = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!upload.ok) {
        const data = await upload.json();
        setError(data.error ?? "Ошибка загрузки");
        return;
      }
      const { url } = await upload.json();
      const res = await fetch(`/api/admin/partners/${partner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: partner.name,
          logo: url,
          url: partner.url ?? "",
          order: partner.order,
          isActive: partner.isActive,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Ошибка сохранения");
        return;
      }
      router.refresh();
    } catch {
      setError("Ошибка сети");
    } finally {
      setReplacingId(null);
    }
  }

  return (
    <>
      {error && (
        <div className="mb-3 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {partners.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl border border-slate-200 p-4 relative shadow-sm hover:shadow-md transition-all"
          >
            <div className="aspect-[3/2] w-full flex items-center justify-center bg-slate-50 rounded-md overflow-hidden mb-3 relative">
              {p.logo ? (
                <img
                  src={p.logo}
                  alt={p.name}
                  className="max-w-[80%] max-h-[80%] object-contain"
                />
              ) : (
                <span className="text-slate-300 text-xs">no logo</span>
              )}
              {replacingId === p.id && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-xs text-slate-600">
                  Загрузка...
                </div>
              )}
            </div>
            <div className="flex gap-1.5">
              <label className="flex-1 cursor-pointer inline-flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium border border-slate-200 rounded-md text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Заменить
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleReplace(p, file);
                    e.target.value = "";
                  }}
                  disabled={replacingId === p.id}
                />
              </label>
              <button
                onClick={() => setDeleteTarget(p)}
                className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium border border-red-200 rounded-md text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Удалить
              </button>
            </div>
          </div>
        ))}
        {partners.length === 0 && (
          <div className="col-span-full px-5 py-12 text-center text-slate-400 text-sm bg-white rounded-xl border border-slate-200">
            Партнёров пока нет.
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Удалить партнёра?"
        description="Логотип исчезнет с сайта. Действие нельзя отменить."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
