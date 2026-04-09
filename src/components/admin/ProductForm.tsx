"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormField, AdminInput, AdminTextarea, AdminSelect } from "./FormField";
import { MultiSelect } from "./MultiSelect";
import { StandardsInput } from "./StandardsInput";

const TRANSLIT: Record<string, string> = {
  а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"j",
  к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",
  х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya",
};

function toSlug(ru: string): string {
  return ru.toLowerCase().split("").map((c) => TRANSLIT[c] ?? (c === " " ? "-" : c)).join("")
    .replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

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

interface Category { id: string; nameRu: string; }

interface ProductFormData {
  id: string; nameRu: string; nameUz: string;
  descRu: string; descUz: string; categoryId: string;
  typeRu: string; typeUz: string;
  materials: string[]; purposes: string[]; standards: string[];
  image: string;
}

interface ProductFormProps {
  initialData?: ProductFormData;
  categories: Category[];
  mode: "create" | "edit";
}

function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) { onChange(data.url); }
      else { setError(data.error ?? "Ошибка загрузки"); }
    } catch { setError("Ошибка сети"); }
    finally { setUploading(false); }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  }

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative group w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50" style={{ aspectRatio: "16/9", maxHeight: 260 }}>
          <Image src={value} alt="Product image" fill className="object-contain" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-100"
            >
              Заменить
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-500"
            >
              Удалить
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`cursor-pointer border-2 border-dashed rounded-xl p-10 text-center transition-all ${
            dragOver ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:border-blue-400 hover:bg-blue-50/50"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <svg className="w-6 h-6 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span className="text-sm">Загрузка...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium text-slate-600">Перетащите фото или <span className="text-blue-600">выберите файл</span></p>
              <p className="text-xs text-slate-400">JPG, PNG, WEBP — до 5 МБ</p>
            </div>
          )}
        </div>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

export function ProductForm({ initialData, categories, mode }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>(
    initialData ?? {
      id: "", nameRu: "", nameUz: "", descRu: "", descUz: "",
      categoryId: categories[0]?.id ?? "", typeRu: "", typeUz: "",
      materials: [], purposes: [], standards: [], image: "",
    }
  );
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field: keyof ProductFormData, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleNameRuChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, nameRu: val, id: toSlug(val) }));
    setErrors((prev) => ({ ...prev, nameRu: undefined, id: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    setLoading(true);
    const url = mode === "create" ? "/api/admin/products" : `/api/admin/products/${initialData!.id}`;
    const method = mode === "create" ? "POST" : "PUT";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { router.push("/admin/products"); router.refresh(); }
      else {
        const data = await res.json();
        if (data.details?.fieldErrors) {
          const fe: typeof errors = {};
          for (const [k, v] of Object.entries(data.details.fieldErrors))
            fe[k as keyof ProductFormData] = (v as string[])[0];
          setErrors(fe);
        } else { setServerError(data.error ?? "Ошибка сохранения"); }
      }
    } catch { setServerError("Ошибка сети"); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl bg-white rounded-xl border border-slate-200 p-8 shadow-sm">

      {/* Image upload */}
      <FormField label="Фото продукта">
        <ImageUpload value={form.image} onChange={(url) => set("image", url)} />
      </FormField>

      {/* Names */}
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Название (RU)" error={errors.nameRu} required>
          <AdminInput
            value={form.nameRu}
            onChange={mode === "create" ? handleNameRuChange : (e) => set("nameRu", e.target.value)}
            error={!!errors.nameRu}
          />
        </FormField>
        <FormField label="Название (UZ)" error={errors.nameUz} required>
          <AdminInput value={form.nameUz} onChange={(e) => set("nameUz", e.target.value)} error={!!errors.nameUz} />
        </FormField>
      </div>

      {/* Descriptions */}
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Описание (RU)" error={errors.descRu} required>
          <AdminTextarea value={form.descRu} onChange={(e) => set("descRu", e.target.value)} error={!!errors.descRu} />
        </FormField>
        <FormField label="Описание (UZ)" error={errors.descUz} required>
          <AdminTextarea value={form.descUz} onChange={(e) => set("descUz", e.target.value)} error={!!errors.descUz} />
        </FormField>
      </div>

      {/* Category */}
      <FormField label="Категория" error={errors.categoryId} required>
        <AdminSelect value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} error={!!errors.categoryId}>
          {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.nameRu}</option>)}
        </AdminSelect>
      </FormField>

      {/* Types */}
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Тип продукта (RU)" error={errors.typeRu} required>
          <AdminInput value={form.typeRu} onChange={(e) => set("typeRu", e.target.value)} placeholder="Трубы" error={!!errors.typeRu} />
        </FormField>
        <FormField label="Тип продукта (UZ)" error={errors.typeUz} required>
          <AdminInput value={form.typeUz} onChange={(e) => set("typeUz", e.target.value)} placeholder="Quvurlar" error={!!errors.typeUz} />
        </FormField>
      </div>

      {/* Materials */}
      <FormField label="Материалы" error={errors.materials} required>
        <MultiSelect options={MATERIALS} value={form.materials} onChange={(v) => set("materials", v)} />
      </FormField>

      {/* Purposes */}
      <FormField label="Назначение" error={errors.purposes} required>
        <MultiSelect options={PURPOSES} value={form.purposes} onChange={(v) => set("purposes", v)} />
      </FormField>

      {/* Standards */}
      <FormField label="Стандарты (ГОСТ, API...)">
        <StandardsInput value={form.standards} onChange={(v) => set("standards", v)} />
      </FormField>

      {serverError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-700">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {serverError}
        </div>
      )}

      <div className="flex gap-3 pt-2 border-t border-slate-100">
        <button type="submit" disabled={loading}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-sm shadow-blue-600/20">
          {loading ? (
            <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>Сохранение...</>
          ) : mode === "create" ? "Создать продукт" : "Сохранить изменения"}
        </button>
        <button type="button" onClick={() => router.push("/admin/products")}
          className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          Отмена
        </button>
      </div>
    </form>
  );
}
