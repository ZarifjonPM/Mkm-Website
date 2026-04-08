import type { Product, CatalogFilters } from "@/types/catalog";
import type { Locale } from "@/i18n/config";
import catalogData from "@/data/catalog.json";

export function getAllProducts(): Product[] {
  return catalogData.products as Product[];
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
