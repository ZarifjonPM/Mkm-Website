import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  getCategoryBySlug,
  getProductById,
  getProductsByCategory,
} from "@/lib/catalog";
import { getProductImage } from "@/lib/category-images";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mkm-metal.uz";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; category: string; product: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  if (!isValidLocale(locale)) {
    return { title: "MKM Metal" };
  }

  const product = await getProductById(params.product);
  if (!product || product.categoryId !== params.category) {
    return { title: locale === "uz" ? "Mahsulot topilmadi" : "Товар не найден" };
  }

  const category = await getCategoryBySlug(product.categoryId);
  const categoryName = category?.name[locale] ?? "";
  const name = product.name[locale];
  const region = locale === "uz" ? "Toshkent, O'zbekiston" : "Ташкент, Узбекистан";

  const title =
    locale === "uz"
      ? `${name} — narxi va yetkazib berish`
      : `${name} — цена и поставка`;

  const stdText = product.standards.length
    ? (locale === "uz" ? ` Standartlar: ${product.standards.join(", ")}.` : ` Стандарты: ${product.standards.join(", ")}.`)
    : "";
  const description =
    `${product.description[locale]}${stdText} ${
      locale === "uz"
        ? `${categoryName} — ulgurji va chakana yetkazib berish, ${region}.`
        : `${categoryName} — оптом и в розницу с доставкой, ${region}.`
    }`.trim();

  const dict = await getDictionary(locale);
  const materialWords = product.materials.map(
    (m) => dict.materials[m as keyof typeof dict.materials]
  );
  const keywords = [
    name,
    product.productType[locale],
    categoryName,
    ...materialWords,
    ...product.standards,
    locale === "uz" ? "MKM Metal Toshkent" : "MKM Metal Ташкент",
  ].filter(Boolean);

  const url = `${BASE_URL}/${locale}/catalog/${product.categoryId}/${product.id}`;
  const image = product.image || `${BASE_URL}${getProductImage(product.categoryId, 0)}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: {
        ru: `${BASE_URL}/ru/catalog/${product.categoryId}/${product.id}`,
        uz: `${BASE_URL}/uz/catalog/${product.categoryId}/${product.id}`,
      },
    },
    openGraph: {
      url,
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { locale: string; category: string; product: string };
}) {
  const locale = params.locale as Locale;
  if (!isValidLocale(locale)) notFound();

  const product = await getProductById(params.product);
  if (!product || product.categoryId !== params.category) notFound();

  const category = await getCategoryBySlug(product.categoryId);
  if (!category) notFound();

  const dict = await getDictionary(locale);

  const heroImage = product.image || getProductImage(product.categoryId, 0);

  // Rich descriptions may contain several paragraphs separated by blank lines,
  // optionally ending with a "Характеристики:"/"Xususiyatlari:" specs paragraph.
  const specsLabels = ["характеристики:", "xususiyatlari:"];
  const descParagraphs = product.description[locale]
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);
  const heroTeaser =
    (descParagraphs[0] || product.description[locale]).split(
      /(?<=[.!?…])\s+/
    )[0] || product.description[locale];

  const related = (await getProductsByCategory(product.categoryId))
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const t = {
    catalog: dict.catalog.title,
    specs: locale === "uz" ? "Xususiyatlari" : "Характеристики",
    category: dict.catalog.category,
    type: dict.catalog.productType,
    material: dict.catalog.material,
    purpose: dict.catalog.purpose,
    standards: dict.catalog.standards,
    description: locale === "uz" ? "Tavsif" : "Описание",
    ctaTitle:
      locale === "uz"
        ? "Ushbu mahsulotga narx kerakmi?"
        : "Нужна цена на этот товар?",
    ctaText:
      locale === "uz"
        ? "Zayavka qoldiring — hajm va standartga qarab narx va yetkazib berish muddatini hisoblab beramiz."
        : "Оставьте заявку — рассчитаем стоимость и сроки поставки под ваш объём и стандарт.",
    ctaButton: locale === "uz" ? "Zayavka qoldirish" : "Оставить заявку",
    related: locale === "uz" ? "Shu turkumdagi boshqa mahsulotlar" : "Другие товары категории",
    back: locale === "uz" ? "Katalogga qaytish" : "Вернуться в каталог",
    more: locale === "uz" ? "Batafsil" : "Подробнее",
  };

  const materialWords = product.materials.map(
    (m) => dict.materials[m as keyof typeof dict.materials]
  );
  const purposeWords = product.purposes.map(
    (p) => dict.purposes[p as keyof typeof dict.purposes]
  );

  const specs: { label: string; value: string }[] = [
    { label: t.category, value: category.name[locale] },
    { label: t.type, value: product.productType[locale] },
    { label: t.material, value: materialWords.join(", ") },
    { label: t.purpose, value: purposeWords.join(", ") },
  ];
  if (product.standards.length) {
    specs.push({ label: t.standards, value: product.standards.join(", ") });
  }

  const arrow = (
    <svg
      className="ml-1 h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
      />
    </svg>
  );

  return (
    <>
      {/* Hero */}
      <section className="bg-brand py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 text-sm text-white/60">
            <Link href={`/${locale}/catalog`} className="hover:text-white">
              {t.catalog}
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/${locale}/catalog/${category.slug}`}
              className="hover:text-white"
            >
              {category.name[locale]}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">{product.name[locale]}</span>
          </nav>

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-block rounded-md bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                {product.productType[locale]}
              </span>
              <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                {product.name[locale]}
              </h1>
              <div className="mt-3 h-1 w-16 rounded-full bg-accent" />
              <p className="mt-5 text-base text-white/70 sm:text-lg">
                {heroTeaser}
              </p>

              {product.standards.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {product.standards.map((std) => (
                    <span
                      key={std}
                      className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80"
                    >
                      {std}
                    </span>
                  ))}
                </div>
              )}

              <Link
                href={`/${locale}/contacts#form`}
                className="mt-8 inline-flex items-center rounded-lg bg-accent px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark sm:text-base"
              >
                {t.ctaButton}
              </Link>
            </div>

            <div className="relative h-64 overflow-hidden rounded-2xl bg-black/20 lg:h-96">
              <Image
                src={heroImage}
                alt={product.name[locale]}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Specs + description */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* Characteristics */}
            <div>
              <h2 className="text-2xl font-bold text-brand sm:text-3xl">
                {t.specs}
              </h2>
              <div className="mt-3 h-1 w-12 rounded-full bg-accent" />
              <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <tbody>
                    {specs.map((row, i) => (
                      <tr
                        key={row.label}
                        className={i % 2 === 0 ? "bg-white" : "bg-surface"}
                      >
                        <th className="w-2/5 px-4 py-3 text-left align-top font-medium text-gray-500">
                          {row.label}
                        </th>
                        <td className="px-4 py-3 align-top text-brand">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-brand sm:text-3xl">
                {t.description}
              </h2>
              <div className="mt-3 h-1 w-12 rounded-full bg-accent" />
              <div className="mt-6 space-y-4">
                {descParagraphs.map((para, i) => {
                  const lower = para.toLowerCase();
                  const labelHit = specsLabels.find((l) => lower.startsWith(l));
                  if (labelHit) {
                    const label = para.slice(0, labelHit.length).replace(/:$/, "");
                    const rest = para.slice(labelHit.length).trim();
                    return (
                      <p
                        key={i}
                        className="text-base leading-relaxed text-gray-600"
                      >
                        <span className="font-semibold text-brand">
                          {label}:
                        </span>{" "}
                        {rest}
                      </p>
                    );
                  }
                  return (
                    <p
                      key={i}
                      className="text-base leading-relaxed text-gray-600"
                    >
                      {para}
                    </p>
                  );
                })}
              </div>
              <Link
                href={`/${locale}/catalog/${category.slug}`}
                className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-dark"
              >
                <svg
                  className="h-4 w-4 rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
                {category.name[locale]}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-brand p-8 text-center sm:p-12 lg:p-16">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              {t.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">{t.ctaText}</p>
            <Link
              href={`/${locale}/contacts#form`}
              className="mt-8 inline-flex items-center rounded-lg bg-accent px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark sm:text-base"
            >
              {t.ctaButton}
            </Link>
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="bg-white py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-brand sm:text-3xl">
              {t.related}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {related.map((rel, index) => {
                const thumb = rel.image || getProductImage(rel.categoryId, index);
                return (
                  <Link
                    key={rel.id}
                    href={`/${locale}/catalog/${rel.categoryId}/${rel.id}`}
                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
                  >
                    <div className="relative h-40 overflow-hidden bg-gray-100">
                      <Image
                        src={thumb}
                        alt={rel.name[locale]}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-brand group-hover:text-accent">
                        {rel.name[locale]}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                        {rel.description[locale]}
                      </p>
                      <span className="mt-4 inline-flex items-center text-sm font-medium text-accent">
                        {t.more}
                        {arrow}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <Link
              href={`/${locale}/catalog`}
              className="mt-10 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-dark"
            >
              <svg
                className="h-4 w-4 rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
              {t.back}
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
