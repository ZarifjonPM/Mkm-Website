"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormField, AdminInput, AdminTextarea, AdminSelect } from "./FormField";
import { ImageUploader } from "./ImageUploader";

const TRANSLIT: Record<string, string> = {
  а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"j",
  к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",
  х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya",
};

function toSlug(ru: string): string {
  return ru
    .toLowerCase()
    .split("")
    .map((c) => TRANSLIT[c] ?? (c === " " ? "-" : c))
    .join("")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const ICON_OPTIONS = [
  { value: "building", label: "🏢 Здание" },
  { value: "pipe", label: "🔩 Труба" },
  { value: "certificate", label: "📜 Сертификат" },
  { value: "flame", label: "🔥 Огонь / Нефтегаз" },
  { value: "truck", label: "🚚 Доставка" },
  { value: "settings", label: "⚙️ Настройки" },
  { value: "shield", label: "🛡️ Качество" },
];

interface ServiceFormData {
  id?: string;
  slug: string;
  icon: string;
  titleRu: string;
  titleUz: string;
  descriptionRu: string;
  descriptionUz: string;
  image: string;
  order: number;
  isActive: boolean;
}

interface ServiceFormProps {
  initialData?: ServiceFormData;
  mode: "create" | "edit";
}

export function ServiceForm({ initialData, mode }: ServiceFormProps) {
  const router = useRouter();
  const redirectPath = "/admin/services";

  const [form, setForm] = useState<ServiceFormData>(
    initialData ?? {
      slug: "", icon: "building", titleRu: "", titleUz: "",
      descriptionRu: "", descriptionUz: "", image: "", order: 0, isActive: true,
    }
  );
  const [errors, setErrors] = useState<Partial<Record<keyof ServiceFormData, string>>>({});
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
      const t = setTimeout(() => router.push(redirectPath), 800);
      return () => clearTimeout(t);
    }
  }, [progress, router, redirectPath]);

  function set<K extends keyof ServiceFormData>(field: K, value: ServiceFormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleTitleRuChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setForm((prev) => ({
      ...prev,
      titleRu: val,
      slug: mode === "create" ? toSlug(val) : prev.slug,
    }));
    setErrors((prev) => ({ ...prev, titleRu: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    setLoading(true);

    const url =
      mode === "create"
        ? "/api/admin/services"
        : `/api/admin/services/${initialData!.id}`;
    const method = mode === "create" ? "POST" : "PUT";
    const { id: _serviceId, ...rest } = form;
    void _serviceId;
    const payload = rest;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, order: Number(payload.order) }),
      });

      if (res.ok) {
        setSaved(true);
      } else {
        const data = await res.json();
        if (data.details?.fieldErrors) {
          const fieldErrors: typeof errors = {};
          for (const [k, v] of Object.entries(data.details.fieldErrors)) {
            fieldErrors[k as keyof ServiceFormData] = (v as string[])[0];
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Заголовок (RU)" error={errors.titleRu} required>
          <AdminInput
            value={form.titleRu}
            onChange={handleTitleRuChange}
            error={!!errors.titleRu}
          />
        </FormField>
        <FormField label="Заголовок (UZ)" error={errors.titleUz} required>
          <AdminInput
            value={form.titleUz}
            onChange={(e) => set("titleUz", e.target.value)}
            error={!!errors.titleUz}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Описание (RU)" error={errors.descriptionRu} required>
          <AdminTextarea
            value={form.descriptionRu}
            onChange={(e) => set("descriptionRu", e.target.value)}
            error={!!errors.descriptionRu}
            rows={4}
          />
        </FormField>
        <FormField label="Описание (UZ)" error={errors.descriptionUz} required>
          <AdminTextarea
            value={form.descriptionUz}
            onChange={(e) => set("descriptionUz", e.target.value)}
            error={!!errors.descriptionUz}
            rows={4}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <FormField label="Slug (URL)" error={errors.slug} required hint="kebab-case, латиница">
          <AdminInput
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            error={!!errors.slug}
          />
        </FormField>
        <FormField label="Иконка" error={errors.icon} required>
          <AdminSelect
            value={form.icon}
            onChange={(e) => set("icon", e.target.value)}
            error={!!errors.icon}
          >
            {ICON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </AdminSelect>
        </FormField>
        <FormField label="Порядок" error={errors.order}>
          <AdminInput
            type="number"
            min={0}
            value={form.order}
            onChange={(e) => set("order", Number(e.target.value))}
            error={!!errors.order}
          />
        </FormField>
      </div>

      <ImageUploader
        value={form.image}
        onChange={(url) => set("image", url)}
        label="Изображение услуги (необязательно)"
      />

      <FormField label="Активен">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => set("isActive", e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700">
            {form.isActive ? "Отображается на сайте" : "Скрыт"}
          </span>
        </label>
      </FormField>

      {serverError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-700">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {serverError}
        </div>
      )}

      {saved ? (
        <div className="space-y-3 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-2 text-green-700">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
            </svg>
            <span className="font-semibold text-sm">Сохранено</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-green-600">
              <span>{progress < 100 ? "Публикация..." : "✓ На сайте"}</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="h-2 bg-green-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 pt-2 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-sm shadow-blue-600/20"
          >
            {loading ? "Сохранение..." : mode === "create" ? "Создать услугу" : "Сохранить изменения"}
          </button>
          <button
            type="button"
            onClick={() => router.push(redirectPath)}
            className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Отмена
          </button>
        </div>
      )}
    </form>
  );
}
