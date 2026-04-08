"use client";

import { Suspense } from "react";
import type { Product } from "@/types/catalog";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { CatalogContent } from "./CatalogContent";

interface CatalogClientProps {
  products: Product[];
  locale: Locale;
  dict: Dictionary;
}

export function CatalogClient({ products, locale, dict }: CatalogClientProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">...</div>}>
      <CatalogContent products={products} locale={locale} dict={dict} />
    </Suspense>
  );
}
