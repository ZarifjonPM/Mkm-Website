"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function PartnerQuickUpload() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
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
      const res = await fetch("/api/admin/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Партнёр",
          logo: url,
          url: "",
          order: Date.now() % 100000,
          isActive: true,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Ошибка сохранения");
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/admin/partners"), 700);
    } catch {
      setError("Ошибка сети");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-xl bg-white rounded-xl border border-slate-200 p-10 shadow-sm">
      <div
        className="border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          disabled={uploading}
        />

        {done ? (
          <>
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-800">Партнёр добавлен</p>
            <p className="text-xs text-slate-500 mt-1">Перенаправляем...</p>
          </>
        ) : uploading ? (
          <>
            <svg className="w-10 h-10 text-blue-500 animate-spin mb-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm font-semibold text-slate-800">Загрузка...</p>
          </>
        ) : (
          <>
            <svg className="w-10 h-10 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-semibold text-slate-800">Выберите логотип партнёра</p>
            <p className="text-xs text-slate-500 mt-1">JPG, PNG, WEBP или GIF, до 5 МБ</p>
          </>
        )}
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
