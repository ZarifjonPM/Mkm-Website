import Link from "next/link";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <>
      <AdminTopbar
        title="Новая категория"
        actions={
          <Link href="/admin/categories" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад
          </Link>
        }
      />
      <div className="p-8 max-w-3xl">
        <CategoryForm mode="create" />
      </div>
    </>
  );
}
