import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getAllProducts } from "@/lib/catalog";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CatalogClient } from "@/components/catalog/CatalogClient";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mkm-metal.uz";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;

  const title = locale === "uz" ? "Mahsulot katalogi" : "Каталог продукции";
  const description =
    locale === "uz"
      ? "To'liq metall prokat katalogi: quvurlar, armatura, varaqlar, burchaklar. 100+ mahsulot. O'zbekiston bo'ylab ulgurji yetkazib berish."
      : "Полный каталог металлопроката: трубы, арматура, листы, уголки и другие изделия. Более 100 наименований. Оптовые поставки по всему Узбекистану.";

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/catalog`,
      languages: { ru: `${BASE_URL}/ru/catalog`, uz: `${BASE_URL}/uz/catalog` },
    },
    openGraph: {
      url: `${BASE_URL}/${locale}/catalog`,
      title,
      description,
    },
  };
}

export default async function CatalogPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);
  const products = await getAllProducts();

  return (
    <section className="bg-surface py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={dict.catalog.title} />
        <CatalogClient products={products} locale={locale} dict={dict} />
      </div>
    </section>
  );
}
