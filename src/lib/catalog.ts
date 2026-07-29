import type { Product, Category, CatalogFilters, MaterialId, PurposeId } from "@/types/catalog";
import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/db";

function toProduct(row: {
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
  image: string;
}): Product {
  return {
    id: row.id,
    name: { ru: row.nameRu, uz: row.nameUz },
    description: { ru: row.descRu, uz: row.descUz },
    categoryId: row.categoryId,
    productType: { ru: row.typeRu, uz: row.typeUz },
    materials: row.materials as MaterialId[],
    purposes: row.purposes as PurposeId[],
    standards: row.standards,
    image: row.image ?? "",
  };
}

function toCategory(row: {
  id: string;
  nameRu: string;
  nameUz: string;
  slug: string;
  descRu: string;
  descUz: string;
  icon: string;
  image: string;
  order: number;
}): Category {
  return {
    id: row.id,
    name: { ru: row.nameRu, uz: row.nameUz },
    slug: row.slug,
    description: { ru: row.descRu, uz: row.descUz },
    icon: row.icon,
    image: row.image,
    order: row.order,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    orderBy: [{ categoryId: "asc" }, { id: "asc" }],
  });
  return rows.map(toProduct);
}

export async function getAllCategories(): Promise<Category[]> {
  const rows = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });
  return rows.map(toCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const row = await prisma.category.findUnique({ where: { id: slug } });
  return row ? toCategory(row) : null;
}

export async function getProductsByCategory(
  categoryId: string
): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { categoryId },
    orderBy: { id: "asc" },
  });
  return rows.map(toProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { id } });
  return row ? toProduct(row) : null;
}

export function filterProducts(
  products: Product[],
  filters: CatalogFilters,
  locale: Locale
): Product[] {
  return products.filter((product) => {
    if (filters.category && product.categoryId !== filters.category) return false;
    if (filters.productType && product.productType[locale] !== filters.productType) return false;
    if (filters.material && !product.materials.includes(filters.material)) return false;
    if (filters.purpose && !product.purposes.includes(filters.purpose)) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const searchable = `${product.name[locale]} ${product.description[locale]} ${product.standards.join(" ")}`.toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });
}

export function getProductTypesForCategory(
  products: Product[],
  categoryId: string,
  locale: Locale
): string[] {
  const types = new Set<string>();
  products
    .filter((p) => p.categoryId === categoryId)
    .forEach((p) => types.add(p.productType[locale]));
  return Array.from(types).sort();
}
