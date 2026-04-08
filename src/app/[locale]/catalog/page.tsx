import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getAllProducts } from "@/lib/catalog";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CatalogClient } from "@/components/catalog/CatalogClient";

export const metadata: Metadata = {
  title: "Каталог продукции",
};

export default async function CatalogPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);
  const products = getAllProducts();

  return (
    <section className="bg-surface py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={dict.catalog.title} />
        <CatalogClient products={products} locale={locale} dict={dict} />
      </div>
    </section>
  );
}
