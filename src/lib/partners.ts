import { prisma } from "@/lib/db";

export interface PartnerRecord {
  id: string;
  name: string;
  logo: string;
  url: string | null;
  order: number;
  isActive: boolean;
}

export async function getActivePartners(): Promise<PartnerRecord[]> {
  return prisma.partner.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getAllPartnersAdmin(): Promise<PartnerRecord[]> {
  return prisma.partner.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}
