import { prisma } from "@/lib/db";

export interface SiteSettingsRecord {
  id: string;
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

const DEFAULT_SETTINGS: SiteSettingsRecord = {
  id: "singleton",
  phone1: "+998 88 999 38 38",
  phone2: "+998 88 979 79 97",
  email: "mkm_metal@mail.ru",
  addressRu: "г. Ташкент, ул. Темирчи, 19",
  addressUz: "Toshkent sh., Temirchi ko'ch., 19",
  mapEmbedUrl: "",
  telegramUrl: "",
  instagramUrl: "",
  whatsappUrl: "",
  workingHoursRu: "",
  workingHoursUz: "",
};

export async function getSiteSettings(): Promise<SiteSettingsRecord> {
  const row = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (!row) return DEFAULT_SETTINGS;
  return {
    id: row.id,
    phone1: row.phone1,
    phone2: row.phone2,
    email: row.email,
    addressRu: row.addressRu,
    addressUz: row.addressUz,
    mapEmbedUrl: row.mapEmbedUrl,
    telegramUrl: row.telegramUrl,
    instagramUrl: row.instagramUrl,
    whatsappUrl: row.whatsappUrl,
    workingHoursRu: row.workingHoursRu,
    workingHoursUz: row.workingHoursUz,
  };
}

export function getPhonesArray(settings: SiteSettingsRecord): string[] {
  return [settings.phone1, settings.phone2].filter((p) => p && p.trim().length > 0);
}
