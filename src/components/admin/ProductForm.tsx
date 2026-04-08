"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField, AdminInput, AdminTextarea, AdminSelect } from "./FormField";
import { MultiSelect } from "./MultiSelect";
import { StandardsInput } from "./StandardsInput";

const MATERIALS = [
  { value: "carbon-steel", label: "Чёрная сталь" },
  { value: "stainless-steel", label: "Нержавейка" },
  { value: "alloy-steel", label: "Легированная сталь" },
  { value: "cast-iron", label: "Чугун" },
  { value: "non-ferrous", label: "Цветные металлы" },
];

const PURPOSES = [
  { value: "oil-gas", label: "Нефть и газ" },
  { value: "construction", label: "Строительство" },
  { value: "mechanical", label: "Машиностроение" },
  { value: "electrical", label: "Электротехника" },
  { value: "industrial", label: "Промышленность" },
];

interface Category {
  id: string;
  nameRu: string;
}

interface ProductFormData {
  id: string;
  nameRu: string;
  nameUz: string;
  descRu: string;
  descUz: string;
  categoryId: string;
  typeRu: string;
  typeUz: string;
  materials: string[];
  purposes: string[];
  standards: string[];
}

interface ProductFormProps {
  initialData?: ProductFormData;
  categories: Category[];
  mode: "create" | "edit";
}

export function ProductForm({ initialData, categories, mode }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>(
    initialData ?? {
      id: "",
      nameRu: "",
      nameUz: "",
      descRu: "",
      descUz: "",
      categoryId: categories[0]?.id ?? "",
      typeRu: "",
      typeUz: "",
      materials: [],
      purposes: [],
      standards: [],
    }
  );
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field: keyof ProductFormData, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    setLoading(true);

    const url =
      mode === "create"
        ? "/api/admin/products"
        : `/api/admin/products/${initialData!.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const data = await res.json();
        if (data.details?.fieldErrors) {
          const fieldErrors: typeof errors = {};
          for (const [k, v] of Object.entries(data.details.fieldErrors)) {
            fieldErrors[k as keyof ProductFormData] = (v as string[])[0];
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
      {/* ID — only on create */}
      {mode === "create" && (
        <FormField label="ID (slug)" error={errors.id} required>
          <AdminInput
            value={form.id}
            onChange={(e) => set("id", e.target.value)}
            placeholder="naprimer-nazvanie-produkta"
            error={!!errors.id}
          />
          <p className="mt-1 text-xs text-gray-400">
            Только латинские буквы, цифры и дефисы. Нельзя изменить после создания.
          </p>
        </FormField>
      )}

      {/* Names */}
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

      {/* Descriptions */}
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

      {/* Category */}
      <FormField label="Категория" error={errors.categoryId} required>
        <AdminSelect
          value={form.categoryId}
          onChange={(e) => set("categoryId", e.target.value)}
          error={!!errors.categoryId}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nameRu}
            </option>
          ))}
        </AdminSelect>
      </FormField>

      {/* Product types */}
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Тип продукта (RU)" error={errors.typeRu} required>
          <AdminInput
            value={form.typeRu}
            onChange={(e) => set("typeRu", e.target.value)}
            placeholder="Трубы"
            error={!!errors.typeRu}
          />
        </FormField>
        <FormField label="Тип продукта (UZ)" error={errors.typeUz} required>
          <AdminInput
            value={form.typeUz}
            onChange={(e) => set("typeUz", e.target.value)}
            placeholder="Quvurlar"
            error={!!errors.typeUz}
          />
        </FormField>
      </div>

      {/* Materials */}
      <FormField label="Материалы" error={errors.materials} required>
        <MultiSelect
          options={MATERIALS}
          value={form.materials}
          onChange={(v) => set("materials", v)}
        />
      </FormField>

      {/* Purposes */}
      <FormField label="Назначение" error={errors.purposes} required>
        <MultiSelect
          options={PURPOSES}
          value={form.purposes}
          onChange={(v) => set("purposes", v)}
        />
      </FormField>

      {/* Standards */}
      <FormField label="Стандарты (ГОСТ, API...)">
        <StandardsInput
          value={form.standards}
          onChange={(v) => set("standards", v)}
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
          ) : mode === "create" ? "Создать продукт" : "Сохранить изменения"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
