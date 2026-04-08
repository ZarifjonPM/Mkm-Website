"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField, AdminInput, AdminTextarea } from "./FormField";

interface CategoryFormData {
  id: string;
  nameRu: string;
  nameUz: string;
  slug: string;
  descRu: string;
  descUz: string;
  icon: string;
  image: string;
  order: number;
}

interface CategoryFormProps {
  initialData?: CategoryFormData;
  mode: "create" | "edit";
}

export function CategoryForm({ initialData, mode }: CategoryFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<CategoryFormData>(
    initialData ?? {
      id: "",
      nameRu: "",
      nameUz: "",
      slug: "",
      descRu: "",
      descUz: "",
      icon: "/icons/",
      image: "/images/",
      order: 1,
    }
  );
  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field: keyof CategoryFormData, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    setLoading(true);

    const url =
      mode === "create"
        ? "/api/admin/categories"
        : `/api/admin/categories/${initialData!.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, order: Number(form.order) }),
      });

      if (res.ok) {
        router.push("/admin/categories");
        router.refresh();
      } else {
        const data = await res.json();
        if (data.details?.fieldErrors) {
          const fieldErrors: typeof errors = {};
          for (const [k, v] of Object.entries(data.details.fieldErrors)) {
            fieldErrors[k as keyof CategoryFormData] = (v as string[])[0];
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
      {mode === "create" && (
        <FormField label="ID (slug)" error={errors.id} required>
          <AdminInput
            value={form.id}
            onChange={(e) => set("id", e.target.value)}
            placeholder="nazvanie-kategorii"
            error={!!errors.id}
          />
        </FormField>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Название (RU)" error={errors.nameRu} required>
          <AdminInput
            value={form.nameRu}
            onChange={(e) => set("nameRu", e.target.value)}
            error={!!errors.nameRu}
          />
        </FormField>
        <FormField label="Название (UZ)" error={errors.nameUz} required>
          <AdminInput
            value={form.nameUz}
            onChange={(e) => set("nameUz", e.target.value)}
            error={!!errors.nameUz}
          />
        </FormField>
      </div>

      <FormField label="Slug (URL)" error={errors.slug} required>
        <AdminInput
          value={form.slug}
          onChange={(e) => set("slug", e.target.value)}
          placeholder="nazvanie-kategorii"
          error={!!errors.slug}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Описание (RU)" error={errors.descRu} required>
          <AdminTextarea
            value={form.descRu}
            onChange={(e) => set("descRu", e.target.value)}
            error={!!errors.descRu}
          />
        </FormField>
        <FormField label="Описание (UZ)" error={errors.descUz} required>
          <AdminTextarea
            value={form.descUz}
            onChange={(e) => set("descUz", e.target.value)}
            error={!!errors.descUz}
          />
        </FormField>
      </div>

      <FormField label="Иконка (путь)" error={errors.icon} required>
        <AdminInput
          value={form.icon}
          onChange={(e) => set("icon", e.target.value)}
          placeholder="/icons/category-name.svg"
          error={!!errors.icon}
        />
      </FormField>

      <FormField label="Изображение (путь)" error={errors.image} required>
        <AdminInput
          value={form.image}
          onChange={(e) => set("image", e.target.value)}
          placeholder="/images/catalog/category-name.jpg"
          error={!!errors.image}
        />
      </FormField>

      <FormField label="Порядок отображения" error={errors.order} required>
        <AdminInput
          type="number"
          min={1}
          value={form.order}
          onChange={(e) => set("order", Number(e.target.value))}
          error={!!errors.order}
          className="w-24"
        />
      </FormField>

      {serverError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-700">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {serverError}
        </div>
      )}

      <div className="flex gap-3 pt-2 border-t border-slate-100">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-sm shadow-blue-600/20"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Сохранение...
            </>
          ) : mode === "create" ? "Создать категорию" : "Сохранить изменения"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/categories")}
          className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
