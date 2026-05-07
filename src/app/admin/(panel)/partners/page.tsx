import Link from "next/link";
import { prisma } from "@/lib/db";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { PartnersTable } from "@/components/admin/PartnersTable";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const partners = await prisma.partner.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <>
      <AdminTopbar
        title="Партнёры"
        actions={
          <Link
            href="/admin/partners/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-blue-600/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Добавить
          </Link>
        }
      />
      <div className="p-8">
        <div className="mb-6 flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-800">{partners.length}</span>
          <span className="text-slate-500 text-sm">партнёров</span>
        </div>
        <PartnersTable partners={partners} />
      </div>
    </>
  );
}
