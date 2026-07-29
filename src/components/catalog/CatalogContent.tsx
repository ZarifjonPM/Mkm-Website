"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product, MaterialId, PurposeId } from "@/types/catalog";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { useCatalogFilters } from "@/hooks/useCatalogFilters";
import { useQuoteModal } from "@/components/shared/QuoteModalProvider";
import { getProductImage } from "@/lib/category-images";
import categories from "@/data/categories.json";

interface CatalogContentProps {
  products: Product[];
  locale: Locale;
  dict: Dictionary;
  /** Active category slug when rendered on a category route (/catalog/[category]). */
  activeCategory?: string | null;
}

const materialIds: MaterialId[] = [
  "carbon-steel",
  "stainless-steel",
  "alloy-steel",
  "cast-iron",
  "non-ferrous",
];

const purposeIds: PurposeId[] = [
  "oil-gas",
  "construction",
  "mechanical",
  "electrical",
  "industrial",
];

export function CatalogContent({
  products,
  locale,
  dict,
  activeCategory = null,
}: CatalogContentProps) {
  const {
    filters,
    filteredProducts,
    setFilter,
    clearFilters,
    filteredCount,
  } = useCatalogFilters(products, locale);

  const { openQuoteModal } = useQuoteModal();
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Product types available within the currently rendered product set
  const availableProductTypes = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.productType[locale]))).sort(),
    [products, locale]
  );

  const hasActiveFilters =
    filters.productType || filters.material || filters.purpose || filters.search;

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Mobile filter toggle */}
      <button
        onClick={() => setFiltersOpen(!filtersOpen)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-brand lg:hidden"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
          />
        </svg>
        {dict.catalog.filters}
        {(hasActiveFilters || activeCategory) && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-white">
            !
          </span>
        )}
      </button>

      {/* Filter Panel */}
      <aside
        className={`w-full shrink-0 lg:w-72 lg:block ${
          filtersOpen ? "block" : "hidden lg:block"
        }`}
      >
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] space-y-6 overflow-y-auto rounded-xl border border-gray-200 bg-white p-5">
          {/* Search */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
              {dict.catalog.search}
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value || null)}
              placeholder={dict.catalog.searchPlaceholder}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Category — real URLs (/catalog/[category]) */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
              {dict.catalog.category}
            </label>
            <div className="space-y-1">
              <Link
                href={`/${locale}/catalog`}
                className={`block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                  !activeCategory
                    ? "bg-accent/10 font-medium text-accent"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {dict.catalog.allCategories}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${locale}/catalog/${cat.slug}`}
                  className={`block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                    activeCategory === cat.slug
                      ? "bg-accent/10 font-medium text-accent"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {cat.name[locale as keyof typeof cat.name]}
                </Link>
              ))}
            </div>
          </div>

          {/* Product Type (dynamic, only within a category) */}
          {activeCategory && availableProductTypes.length > 1 && (
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                {dict.catalog.productType}
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setFilter("productType", null)}
                  className={`block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                    !filters.productType
                      ? "bg-accent/10 font-medium text-accent"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {dict.catalog.allTypes}
                </button>
                {availableProductTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter("productType", type)}
                    className={`block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                      filters.productType === type
                        ? "bg-accent/10 font-medium text-accent"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Material */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
              {dict.catalog.material}
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setFilter("material", null)}
                className={`block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                  !filters.material
                    ? "bg-accent/10 font-medium text-accent"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {dict.catalog.allMaterials}
              </button>
              {materialIds.map((id) => (
                <button
                  key={id}
                  onClick={() => setFilter("material", id)}
                  className={`block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                    filters.material === id
                      ? "bg-accent/10 font-medium text-accent"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {dict.materials[id as keyof typeof dict.materials]}
                </button>
              ))}
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
              {dict.catalog.purpose}
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setFilter("purpose", null)}
                className={`block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                  !filters.purpose
                    ? "bg-accent/10 font-medium text-accent"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {dict.catalog.allPurposes}
              </button>
              {purposeIds.map((id) => (
                <button
                  key={id}
                  onClick={() => setFilter("purpose", id)}
                  className={`block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                    filters.purpose === id
                      ? "bg-accent/10 font-medium text-accent"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {dict.purposes[id as keyof typeof dict.purposes]}
                </button>
              ))}
            </div>
          </div>

          {/* Clear */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50"
            >
              {dict.catalog.clearFilters}
            </button>
          )}
        </div>
      </aside>

      {/* Product list */}
      <div className="flex-1">
        {/* Active filters + count */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">
            {dict.catalog.results}: <strong>{filteredCount}</strong>{" "}
            {dict.catalog.items}
          </span>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-1.5">
              {filters.productType && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                  {filters.productType}
                  <button
                    onClick={() => setFilter("productType", null)}
                    className="ml-0.5 hover:text-accent-dark"
                  >
                    &times;
                  </button>
                </span>
              )}
              {filters.material && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                  {
                    dict.materials[
                      filters.material as keyof typeof dict.materials
                    ]
                  }
                  <button
                    onClick={() => setFilter("material", null)}
                    className="ml-0.5 hover:text-accent-dark"
                  >
                    &times;
                  </button>
                </span>
              )}
              {filters.purpose && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                  {
                    dict.purposes[
                      filters.purpose as keyof typeof dict.purposes
                    ]
                  }
                  <button
                    onClick={() => setFilter("purpose", null)}
                    className="ml-0.5 hover:text-accent-dark"
                  >
                    &times;
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Products */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <p className="mt-4 font-medium text-gray-500">
              {dict.catalog.noResults}
            </p>
            <p className="mt-1 text-sm text-gray-400">
              {dict.catalog.noResultsHint}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
              >
                <Link
                  href={`/${locale}/catalog/${product.categoryId}/${product.id}`}
                  className="flex flex-1 flex-col"
                >
                  {/* Product image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                      src={product.image || getProductImage(product.categoryId, index)}
                      alt={product.name[locale]}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Category badge */}
                    <div className="absolute left-3 top-3">
                      <span className="rounded-md bg-brand/80 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        {categories.find((c) => c.slug === product.categoryId)
                          ?.name[locale as "ru" | "uz"]}
                      </span>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-sm font-semibold leading-snug text-brand group-hover:text-accent">
                      {product.name[locale]}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-xs text-gray-500">
                      {product.description[locale]}
                    </p>

                    {/* Standards */}
                    {product.standards.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {product.standards.slice(0, 3).map((std) => (
                          <span
                            key={std}
                            className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-medium text-gray-500"
                          >
                            {std}
                          </span>
                        ))}
                        {product.standards.length > 3 && (
                          <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
                            +{product.standards.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>

                {/* CTA */}
                <div className="px-4 pb-4">
                  <button
                    onClick={() =>
                      openQuoteModal({
                        category:
                          categories.find(
                            (c) => c.slug === product.categoryId
                          )?.name[locale as "ru" | "uz"] || "",
                        productName: product.name[locale],
                      })
                    }
                    className="w-full"
                  >
                    <span className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-dark">
                      {dict.catalog.requestQuote}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
