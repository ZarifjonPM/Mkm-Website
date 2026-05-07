"use client";

import { useState, useEffect } from "react";
import { FormField, AdminInput, AdminTextarea } from "./FormField";

interface SettingsData {
  phone1: string;
  phone2: string;
  email: string;
  addressRu: string;
  addressUz: string;
  mapEmbedUrl: string;
  telegramUrl: string;
  instagramUrl: string;
  whatsappUrl: string;
  workingHoursRu: string;
  workingHoursUz: string;
}

export function SiteSettingsForm({ initialData }: { initialData: SettingsData }) {
  const [form, setForm] = useState<SettingsData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof SettingsData, string>>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!saved) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [saved]);

  useEffect(() => {
    if (progress === 100) {
      const t = setTimeout(() => setSaved(false), 1200);
      return () => clearTimeout(t);
    }
  }, [progress]);

  function set<K extends keyof SettingsData>(field: K, value: SettingsData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaved(true);
      } else {
        const data = await res.json();
        if (data.details?.fieldErrors) {
          const fieldErrors: typeof errors = {};
          for (const [k, v] of Object.entries(data.details.fieldErrors)) {
            fieldErrors[k as keyof SettingsData] = (v as string[])[0];
          }
          setErrors(fieldErrors);
        } else {
          setServerError(data.error ?? "Ошибка сохранения");
        }
      }
    } catch {
      setServerError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-6">
        <header>
          <h2 className="text-base font-semibold text-slate-900">Контакты</h2>
          <p className="text-xs text-slate-500 mt-0.5">Отображаются в шапке, футере и на странице /contacts.</p>
        </header>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Телефон 1" error={errors.phone1} required>
            <AdminInput
              value={form.phone1}
              onChange={(e) => set("phone1", e.target.value)}
              error={!!errors.phone1}
              placeholder="+998 88 999 38 38"
            />
          </FormField>
          <FormField label="Телефон 2" error={errors.phone2} hint="необязательно">
            <AdminInput
              value={form.phone2}
              onChange={(e) => set("phone2", e.target.value)}
              error={!!errors.phone2}
              placeholder="+998 88 979 79 97"
            />
          </FormField>
        </div>

        <FormField label="Email" error={errors.email} hint="необязательно">
          <AdminInput
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            error={!!errors.email}
            placeholder="info@example.com"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Адрес (RU)" error={errors.addressRu} required>
            <AdminInput
              value={form.addressRu}
              onChange={(e) => set("addressRu", e.target.value)}
              error={!!errors.addressRu}
            />
          </FormField>
          <FormField label="Адрес (UZ)" error={errors.addressUz} required>
            <AdminInput
              value={form.addressUz}
              onChange={(e) => set("addressUz", e.target.value)}
              error={!!errors.addressUz}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Часы работы (RU)" error={errors.workingHoursRu} hint="например: Пн–Пт 9:00–18:00">
            <AdminInput
              value={form.workingHoursRu}
              onChange={(e) => set("workingHoursRu", e.target.value)}
              error={!!errors.workingHoursRu}
            />
          </FormField>
          <FormField label="Часы работы (UZ)" error={errors.workingHoursUz}>
            <AdminInput
              value={form.workingHoursUz}
              onChange={(e) => set("workingHoursUz", e.target.value)}
              error={!!errors.workingHoursUz}
            />
          </FormField>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-6">
        <header>
          <h2 className="text-base font-semibold text-slate-900">Социальные сети</h2>
          <p className="text-xs text-slate-500 mt-0.5">Полные URL. Оставьте пустым, чтобы скрыть иконку.</p>
        </header>

        <div className="grid grid-cols-1 gap-4">
          <FormField label="Telegram" error={errors.telegramUrl}>
            <AdminInput
              value={form.telegramUrl}
              onChange={(e) => set("telegramUrl", e.target.value)}
              error={!!errors.telegramUrl}
              placeholder="https://t.me/your_channel"
            />
          </FormField>
          <FormField label="Instagram" error={errors.instagramUrl}>
            <AdminInput
              value={form.instagramUrl}
              onChange={(e) => set("instagramUrl", e.target.value)}
              error={!!errors.instagramUrl}
              placeholder="https://instagram.com/your_account"
            />
          </FormField>
          <FormField label="WhatsApp" error={errors.whatsappUrl}>
            <AdminInput
              value={form.whatsappUrl}
              onChange={(e) => set("whatsappUrl", e.target.value)}
              error={!!errors.whatsappUrl}
              placeholder="https://wa.me/998889993838"
            />
          </FormField>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-6">
        <header>
          <h2 className="text-base font-semibold text-slate-900">Карта</h2>
          <p className="text-xs text-slate-500 mt-0.5">Вставьте URL из Google Maps Embed (поле <code className="text-xs bg-slate-100 px-1 rounded">src</code> из iframe).</p>
        </header>

        <FormField label="Embed URL" error={errors.mapEmbedUrl}>
          <AdminTextarea
            value={form.mapEmbedUrl}
            onChange={(e) => set("mapEmbedUrl", e.target.value)}
            error={!!errors.mapEmbedUrl}
            rows={3}
            className="font-mono text-xs"
          />
        </FormField>

        {form.mapEmbedUrl && (
          <div className="rounded-lg overflow-hidden border border-slate-200">
            <iframe
              src={form.mapEmbedUrl}
              width="100%"
              height="220"
              style={{ border: 0 }}
              loading="lazy"
              title="Map preview"
            />
          </div>
        )}
      </section>

      {serverError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div className="sticky bottom-0 bg-slate-50 -mx-8 px-8 py-4 border-t border-slate-200 flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-sm shadow-blue-600/20"
        >
          {loading ? "Сохранение..." : "Сохранить настройки"}
        </button>

        {saved && (
          <div className="flex items-center gap-2 text-green-700 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
            </svg>
            <span className="font-semibold">{progress < 100 ? "Применяем..." : "Применено на сайте"}</span>
          </div>
        )}
      </div>
    </form>
  );
}
