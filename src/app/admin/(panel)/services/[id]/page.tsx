import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { ServiceForm } from "@/components/admin/ServiceForm";

export default async function EditServicePage({
  params,
}: {
  params: { id: string };
}) {
  const service = await prisma.service.findUnique({ where: { id: params.id } });
  if (!service) notFound();

  return (
    <>
      <AdminTopbar
        title={`Редактировать: ${service.titleRu}`}
        actions={
          <Link href="/admin/services" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад
          </Link>
        }
      />
      <div className="p-8 max-w-3xl">
        <ServiceForm
          initialData={{
            id: service.id,
            slug: service.slug,
            icon: service.icon,
            titleRu: service.titleRu,
            titleUz: service.titleUz,
            descriptionRu: service.descriptionRu,
            descriptionUz: service.descriptionUz,
            image: service.image,
            order: service.order,
            isActive: service.isActive,
          }}
          mode="edit"
        />
      </div>
    </>
  );
}
