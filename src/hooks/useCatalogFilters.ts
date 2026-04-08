"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useCallback } from "react";
import type { Product, CatalogFilters, MaterialId, PurposeId } from "@/types/catalog";
import type { Locale } from "@/i18n/config";
import { filterProducts, getProductTypesForCategory } from "@/lib/catalog";

export function useCatalogFilters(allProducts: Product[], locale: Locale) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters: CatalogFilters = useMemo(
    () => ({
      category: searchParams.get("category"),
      productType: searchParams.get("type"),
      material: searchParams.get("material") as MaterialId | null,
      purpose: searchParams.get("purpose") as PurposeId | null,
      search: searchParams.get("q") ?? "",
    }),
    [searchParams]
  );

  const filteredProducts = useMemo(
    () => filterProducts(allProducts, filters, locale),
    [allProducts, filters, locale]
  );

  const availableProductTypes = useMemo(() => {
    if (!filters.category) return [];
    return getProductTypesForCategory(allProducts, filters.category, locale);
  }, [allProducts, filters.category, locale]);

  const setFilter = useCallback(
    (key: keyof CatalogFilters, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      const paramMap: Record<keyof CatalogFilters, string> = {
        category: "category",
        productType: "type",
        material: "material",
        purpose: "purpose",
        search: "q",
      };

      if (value === null || value === "") {
        params.delete(paramMap[key]);
      } else {
        params.set(paramMap[key], value);
      }

      // Reset dependent: product type depends on category
      if (key === "category") {
        params.delete("type");
      }

      const qs = params.toString();
      router.replace(qs ? `?${qs}` : ".", { scroll: false });
    },
    [searchParams, router]
  );

  const clearFilters = useCallback(() => {
    router.replace(".", { scroll: false });
  }, [router]);

  return {
    filters,
    filteredProducts,
    availableProductTypes,
    setFilter,
    clearFilters,
    totalCount: allProducts.length,
    filteredCount: filteredProducts.length,
  };
}
