import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getProductsByPurpose } from "@/lib/catalog";
import { getSector, sectors } from "@/data/sectors";
import { CatalogClient } from "@/components/catalog/CatalogClient";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mkm-metal.uz";

export function generateStaticParams() {
  return sectors.map((s) => ({ sector: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; sector: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const sector = isValidLocale(locale) ? getSector(params.sector) : null;
  if (!sector) {
    return { title: locale === "uz" ? "Sahifa topilmadi" : "Страница не найдена" };
  }

  const m = sector.meta[locale];
  const url = `${BASE_URL}/${locale}/otrasli/${sector.slug}`;

  return {
    title: { absolute: m.title },
    description: m.description,
    keywords: m.keywords,
    alternates: {
      canonical: url,
      languages: {
        ru: `${BASE_URL}/ru/otrasli/${sector.slug}`,
        uz: `${BASE_URL}/uz/otrasli/${sector.slug}`,
        "x-default": `${BASE_URL}/ru/otrasli/${sector.slug}`,
      },
    },
    openGraph: {
      url,
      title: m.title,
      description: m.description,
    },
  };
}

export default async function SectorPage({
  params,
}: {
  params: { locale: string; sector: string };
}) {
  const locale = params.locale as Locale;
  if (!isValidLocale(locale)) notFound();

  const sector = getSector(params.sector);
  if (!sector) notFound();

  const dict = await getDictionary(locale);
  const products = await getProductsByPurpose(sector.purpose);
  const seoHtml = sector.seo[locale];
  const name = sector.name[locale];

  return (
    <section className="bg-surface py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-gray-500">
          <Link href={`/${locale}/catalog`} className="hover:text-accent">
            {dict.catalog.title}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-brand">{name}</span>
        </nav>

        <h1 className="text-2xl font-bold text-brand sm:text-3xl">
          {locale === "uz"
            ? `${name} uchun metall prokat`
            : `Металлопрокат для отрасли «${name}»`}
        </h1>
        <div className="mt-3 h-1 w-16 rounded-full bg-accent" />

        <div className="mt-8">
          <CatalogClient products={products} locale={locale} dict={dict} />
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
