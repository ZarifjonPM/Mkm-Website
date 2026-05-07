import { prisma } from "@/lib/db";

export interface ServiceRecord {
  id: string;
  slug: string;
  icon: string;
  titleRu: string;
  titleUz: string;
  descriptionRu: string;
  descriptionUz: string;
  image: string;
  order: number;
  isActive: boolean;
}

export async function getActiveServices(): Promise<ServiceRecord[]> {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getAllServicesAdmin(): Promise<ServiceRecord[]> {
  return prisma.service.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}
