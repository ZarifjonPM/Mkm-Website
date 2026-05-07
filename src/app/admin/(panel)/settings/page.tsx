import { prisma } from "@/lib/db";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";

export const dynamic = "force-dynamic";

const SINGLETON_ID = "singleton";

export default async function AdminSettingsPage() {
  let settings = await prisma.siteSettings.findUnique({ where: { id: SINGLETON_ID } });
  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        id: SINGLETON_ID,
        phone1: "",
        phone2: "",
        email: "",
        addressRu: "",
        addressUz: "",
        mapEmbedUrl: "",
      },
    });
  }

  return (
    <>
      <AdminTopbar title="Настройки сайта" />
      <div className="p-8">
        <SiteSettingsForm
          initialData={{
            phone1: settings.phone1,
            phone2: settings.phone2,
            email: settings.email,
            addressRu: settings.addressRu,
            addressUz: settings.addressUz,
            mapEmbedUrl: settings.mapEmbedUrl,
            telegramUrl: settings.telegramUrl,
            instagramUrl: settings.instagramUrl,
            whatsappUrl: settings.whatsappUrl,
            workingHoursRu: settings.workingHoursRu,
            workingHoursUz: settings.workingHoursUz,
          }}
        />
      </div>
    </>
  );
}
