import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <>
      <AdminTopbar title="Новая категория" />
      <div className="p-6">
        <CategoryForm mode="create" />
      </div>
    </>
  );
}
