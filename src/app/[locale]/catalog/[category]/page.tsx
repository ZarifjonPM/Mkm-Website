import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/catalog";
import { getCategorySeo } from "@/data/category-seo";
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
  const nameLc = name.charAt(0).toLowerCase() + name.slice(1);
  // Единый шаблон мета-тегов для всех категорий (в стиле MKM Metal).
  const title =
    locale === "uz"
      ? `${name} Toshkentda — ulgurji, O'zbekiston bo'ylab yetkazib berish | MKM Metal`
      : `${name} в Ташкенте — купить оптом с доставкой по Узбекистану | MKM Metal`;
  const description =
    locale === "uz"
      ? `${name}ni Toshkentda sotib oling — MKM Metal kompaniyasidan O'zbekiston bo'ylab yetkazib berish bilan. Keng assortiment, GOST, ASTM, DIN standartlari, ulgurji narxlar va tez yetkazib berish.`
      : `Купить ${nameLc} в Ташкенте с доставкой по Узбекистану от компании MKM Metal. Широкий ассортимент, стандарты ГОСТ, ASTM, DIN, оптовые цены и быстрая доставка.`;
  const keywords =
    locale === "uz"
      ? [name, `${name} Toshkent`, `${name} O'zbekiston`, `${name} ulgurji`, `${name} narxi`, "metall prokat Toshkent", "MKM Metal"]
      : [nameLc, `купить ${nameLc} Ташкент`, `${nameLc} Узбекистан`, `${nameLc} оптом`, `${nameLc} цена`, "металлопрокат Ташкент", "MKM Metal"];
  const url = `${BASE_URL}/${locale}/catalog/${category.slug}`;

  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: {
        ru: `${BASE_URL}/ru/catalog/${category.slug}`,
        uz: `${BASE_URL}/uz/catalog/${category.slug}`,
        "x-default": `${BASE_URL}/ru/catalog/${category.slug}`,
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
  const seoHtml = getCategorySeo(category.slug, locale);

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

        {seoHtml && (
          <section className="mt-16 border-t border-gray-200 pt-10">
            <div
              className="max-w-none text-base leading-relaxed text-gray-600 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-brand [&_h2]:sm:text-3xl [&_h2:first-child]:mt-0 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-brand [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_strong]:font-semibold [&_strong]:text-brand"
              dangerouslySetInnerHTML={{ __html: seoHtml }}
            />
          </section>
        )}
      </div>
    </section>
  );
}
