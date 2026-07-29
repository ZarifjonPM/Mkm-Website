import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/catalog";
import { CatalogClient } from "@/components/catalog/CatalogClient";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mkm-metal.uz";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; category: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const category = isValidLocale(locale)
    ? await getCategoryBySlug(params.category)
    : null;

  if (!category) {
    return { title: locale === "uz" ? "Kategoriya topilmadi" : "Категория не найдена" };
  }

  const name = category.name[locale];
  const title =
    locale === "uz"
      ? `${name} — MKM Metal katalogi`
      : `${name} — каталог MKM Metal`;
  const description =
    category.description[locale] ||
    (locale === "uz"
      ? `${name}: assortiment, standartlar va O'zbekiston bo'ylab yetkazib berish. MKM Metal.`
      : `${name}: ассортимент, стандарты и поставки по Узбекистану. MKM Metal.`);
  const url = `${BASE_URL}/${locale}/catalog/${category.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ru: `${BASE_URL}/ru/catalog/${category.slug}`,
        uz: `${BASE_URL}/uz/catalog/${category.slug}`,
      },
    },
    openGraph: {
      url,
      title,
      description,
      images: category.image ? [category.image] : undefined,
    },
  };
}

export default async function CatalogCategoryPage({
  params,
}: {
  params: { locale: string; category: string };
}) {
  const locale = params.locale as Locale;
  if (!isValidLocale(locale)) notFound();

  const category = await getCategoryBySlug(params.category);
  if (!category) notFound();

  const dict = await getDictionary(locale);
  const products = await getProductsByCategory(category.slug);

  return (
    <section className="bg-surface py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-gray-500">
          <Link href={`/${locale}/catalog`} className="hover:text-accent">
            {dict.catalog.title}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-brand">{category.name[locale]}</span>
        </nav>

        <h1 className="text-2xl font-bold text-brand sm:text-3xl">
          {category.name[locale]}
        </h1>
        <div className="mt-3 h-1 w-16 rounded-full bg-accent" />
        {category.description[locale] && (
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600">
            {category.description[locale]}
          </p>
        )}

        <div className="mt-8">
          <CatalogClient
            products={products}
            locale={locale}
            dict={dict}
            activeCategory={category.slug}
          />
        </div>
      </div>
    </section>
  );
}
